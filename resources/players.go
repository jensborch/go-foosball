package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"gorm.io/gorm"
)

// GetPlayer gets player info
// @Summary  Get player
// @Tags     player
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Player ID"
// @Success  200  {object}  model.Player
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /players/{id} [get]
func GetPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		name := c.Param(param)
		r := persistence.NewPlayerRepository(db)
		if p, found := r.Find(name); found {
			c.JSON(http.StatusOK, p)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find %s", name)))
		}
	}
}

// GetPlayers get a list of all players
// @Summary  List players
// @Tags     player
// @Accept   json
// @Produce  json
// @Param    exclude  query    int  false  "exlude tournament from list"
// @Success  200      {array}  model.Player
// @Router   /players [get]
func GetPlayers(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		r := persistence.NewPlayerRepository(db)
		if exclude, found := c.GetQuery("exclude"); found {
			c.JSON(http.StatusOK, r.FindAllNotInTournament(exclude))
		} else {
			c.JSON(http.StatusOK, r.FindAll())
		}
	}
}

type CreatePlayerRequest struct {
	Nickname string `json:"nickname" binding:"gte=2,required"`
	RealName string `json:"realname" binding:"gte=2"`
	RFID     string `json:"rfid"`
} //@name CreatePlayer

// PostPlayer creates a new player
// @Summary  Create a new player
// @Tags     player
// @Accept   json
// @Produce  json
// @Param    player  body      CreatePlayerRequest  true  "Create player"
// @Success  201     {object}  model.Player
// @Failure  400     {object}  ErrorResponse
// @Failure  409     {object}  ErrorResponse
// @Failure  500     {object}  ErrorResponse
// @Router   /players [post]
func PostPlayer(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		var player CreatePlayerRequest
		if err := c.ShouldBindJSON(&player); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewPlayerRepository(tx)
		if _, found := r.Find(player.Nickname); found {
			c.JSON(http.StatusConflict, NewErrorResponse(fmt.Sprintf("Player %s already exists", player.Nickname)))
			return
		}
		p := model.NewPlayer(player.Nickname, player.RealName, player.RFID)
		r.Store(p)
		c.JSON(http.StatusCreated, p)
	}
}

// DeletePlayer deletes a player
// @Summary  Delete player
// @Tags     player
// @Accept   json
// @Produce  json
// @Param    id  path  string  true  "Player ID"
// @Success  204
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /players/{id} [delete]
func DeletePlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		name := c.Param(param)
		r := persistence.NewPlayerRepository(db)
		if found := r.Remove(name); found {
			c.Status(http.StatusNoContent)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find %s", name)))
		}
	}
}
