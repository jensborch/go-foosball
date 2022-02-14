package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin/binding"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
)

// GetPlayer gets player info
// @Summary      Get player
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Player ID"
// @Success      200      {object}  model.Player
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /players/{id} [get]
func GetPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		name := c.Param(param)
		r := persistence.NewPlayerRepository(db)
		p, found, err := r.Find(name)
		if found {
			c.JSON(http.StatusOK, p)
		} else if err == nil {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find %s", name)))
		} else {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		}
	}
}

// GetPlayers get a list of all players
// @Summary      List players
// @Accept       json
// @Produce      json
// @Success      200      {array}   model.Player
// @Router       /players [get]
func GetPlayers(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		r := persistence.NewPlayerRepository(db)
		players := r.FindAll()
		c.JSON(http.StatusOK, players)
	}
}

// PostPlayer creates a new player
// @Summary      Create a new player
// @Accept       json
// @Produce      json
// @Param        player   body      model.Player true  "Create player"
// @Success      200      {object}  model.Player
// @Failure      400      {object}  ErrorResponse
// @Failure      409      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /players [post]
func PostPlayer(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var player model.Player
		if err := c.ShouldBindWith(&player, binding.JSON); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		r := persistence.NewPlayerRepository(tx)
		if _, found, _ := r.Find(player.Nickname); found {
			c.JSON(http.StatusConflict, NewErrorResponse(fmt.Sprintf("Player %s already exists", player.Nickname)))
			tx.Rollback()
			return
		}
		p := model.NewPlayer(player.Nickname, player.RealName)
		if err := r.Store(p); err != nil {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			tx.Rollback()
			return
		}
		c.JSON(http.StatusOK, p)
		tx.Commit()
	}
}

//DeletePlayer deletes a player
// @Summary      Delete player
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Player ID"
// @Success      204      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /players/{id} [delete]
func DeletePlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		name := c.Param(param)
		r := persistence.NewPlayerRepository(db)
		found, err := r.Remove(name)
		if found && err == nil {
			c.JSON(http.StatusNoContent, gin.H{})
		} else if !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find %s", name)))
		} else {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
		}
	}
}
