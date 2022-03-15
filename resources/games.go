package resources

import (
	"fmt"
	"net/http"

	"github.com/jensborch/go-foosball/model"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/jensborch/go-foosball/persistence"
	"gorm.io/gorm"
)

// GetGamesInTournament find all games in tournament
// @Summary      Get all games in a tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {array}   model.GameJson
// @Router       /tournaments/{id}/games [get]
func GetGamesInTournament(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		c.JSON(http.StatusOK, persistence.NewGameRepository(db).FindByTournament(id))
	}
}

// GetRandomGames for a tournament
// @Summary      Get random game for a tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {array}   model.GameJson
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/games/random [get]
func GetRandomGames(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewTournamentRepository(db)
		if games, found, err := r.RandomGames(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			return
		} else {
			c.JSON(http.StatusOK, games)
			return
		}
	}
}

// GameRepresentation represents a played game
type GameRepresentation struct {
	Players []string     `json:"players" binding:"required"`
	Winner  model.Winner `json:"winner,omitempty" binding:"required"`
}

// PostGame saves a played game
// @Summary      Submit gamne results
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Param        table    path      string  true  "Table ID"
// @Param        game     body      GameRepresentation true  "Submit game results"
// @Success      200      {object}  model.GameJson
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/tables/{table}/games [post]
func PostGame(tournamentParam string, tableParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		tourID := c.Param(tournamentParam)
		tableID := c.Param(tableParam)
		var gr GameRepresentation
		if err := c.ShouldBindWith(&gr, binding.JSON); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		tourRepo := persistence.NewTournamentRepository(tx)
		if table, found, _ := tourRepo.FindTable(tourID, tableID); found {
			game := model.NewGame(table)
			for _, nickname := range gr.Players {
				if player, found, _ := tourRepo.FindPlayer(tourID, nickname); found {
					game.AddTournamentPlayer(player)
				} else {
					c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find player %s in tournament %s", nickname, tourID)))
					return
				}
			}
			game.Winner = gr.Winner
			game.UpdateScore()
			if err := persistence.NewGameRepository(tx).Store(game); err != nil {
				panic(err)
			}
			c.JSON(http.StatusOK, game)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find table %s or tournament %s", tableID, tourID)))
		}
	}
}

// GetGame returns a game played
// @Summary      Get gamne results
// @Tags         game
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Game ID"
// @Success      200      {object}  model.GameJson
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /games/{id} [get]
func GetGame(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		if g, found, err := persistence.NewGameRepository(db).Find(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find game %s", id)))
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			return
		} else {
			c.JSON(http.StatusOK, g)
			return
		}
	}
}

// GetGames returns all games
// @Summary      Get all gamne results
// @Tags         game
// @Accept       json
// @Produce      json
// @Success      200      {array}  model.GameJson
// @Router       /games [get]
func GetGames(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, persistence.NewGameRepository(db).FindAll())
	}
}
