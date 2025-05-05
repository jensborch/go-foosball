package resources

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/jensborch/go-foosball/model"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/persistence"
	"gorm.io/gorm"
)

// GetGamesInTournament find all games in tournament
// @Summary  Get all games in a tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id   path     string  true  "Tournament ID"
// @Success  200  {array}  model.GameJson
// @Router   /tournaments/{id}/games [get]
func GetGamesInTournament(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		c.JSON(http.StatusOK, persistence.NewGameRepository(db).FindByTournament(id))
	}
}

// GetRandomGames for a tournament
// @Summary  Get random games for a tournament
// @Tags     actions
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {array}   model.GameJson
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/games/random [get]
func GetRandomGames(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		r := persistence.NewTournamentRepository(db)
		if games, found := r.RandomGames(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		} else {
			c.JSON(http.StatusOK, games)
		}
	}
}

// GameResultRequest represents a played game
type GameResultRequest struct {
	RightPlayers []string     `json:"rightPlayers" binding:"required,gte=1,lte=2"`
	LeftPlayers  []string     `json:"leftPlayers" binding:"required,gte=1,lte=2"`
	Winner       model.Winner `json:"winner,omitempty" enums:"right,left,draw" binding:"gamewinner,required"`
} //@name GameResult

var GameWinnerValidator validator.Func = func(fl validator.FieldLevel) bool {
	winner, ok := fl.Field().Interface().(model.Winner)
	if ok {
		switch winner {
		case model.RIGHT, model.LEFT, model.DRAW:
			return true
		default:
			return false
		}
	}
	return true
}

type addFunc func(*model.TournamentPlayer) error

func addPlayers(tourId string, players []string, repo model.TournamentRepository, add addFunc) model.Found {
	found := true
	for _, nickname := range players {
		if player, found := repo.FindPlayer(tourId, nickname); found {
			add(player)
		} else {
			found = false
		}
	}
	return found
}

// PostGame saves a played game
// @Summary  Submit gamne results
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id     path      string             true  "Tournament ID"
// @Param    table  path      string             true  "Table ID"
// @Param    game   body      GameResultRequest  true  "Submit game results"
// @Success  200    {object}  model.GameJson
// @Failure  400    {object}  ErrorResponse
// @Failure  404    {object}  ErrorResponse
// @Failure  500    {object}  ErrorResponse
// @Router   /tournaments/{id}/tables/{table}/games [post]
func PostGame(tournamentParam string, tableParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		tourId := c.Param(tournamentParam)
		tableId := c.Param(tableParam)
		var gr GameResultRequest
		if err := c.ShouldBindJSON(&gr); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		tourRepo := persistence.NewTournamentRepository(tx)
		if table, found := tourRepo.FindTable(tourId, tableId); found {
			game := model.NewGame(table)
			if found := addPlayers(tourId, gr.LeftPlayers, tourRepo, game.AddLeftTournamentPlayer) &&
				addPlayers(tourId, gr.RightPlayers, tourRepo, game.AddRightTournamentPlayer); !found {
				c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find at least on of the players in tournament %s", tourId)))
				return
			}
			game.Winner = gr.Winner
			game.UpdateScore()
			persistence.NewGameRepository(tx).Store(game)
			c.JSON(http.StatusOK, game)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find table %s or tournament %s", tableId, tourId)))
		}
	}
}

// GetGame returns a game played
// @Summary  Get gamne results
// @Tags     game
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Game ID"
// @Success  200  {object}  model.GameJson
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /games/{id} [get]
func GetGame(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		if g, found := persistence.NewGameRepository(db).Find(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find game %s", id)))
		} else {
			c.JSON(http.StatusOK, g)
		}
	}
}

// GetGames returns all games
// @Summary  Get all gamne results
// @Tags     game
// @Accept   json
// @Produce  json
// @Success  200  {array}  model.GameJson
// @Router   /games [get]
func GetGames(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		c.JSON(http.StatusOK, persistence.NewGameRepository(db).FindAll())
	}
}

var gameEventPublisher = NewEventPublisher()

type GameStartEventRepresentation struct {
	Id string `json:"id" binding:"required"`
} //@name GameStartEvent

// GetGameStart publishes a game start event using web socket
// @Summary  Publishes a game start event
// @Tags     actions
// @Accept   json
// @Produce  json
// @Param    id  path  string  true  "Tournament ID"
// @Success  204
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/games/start [get]
func GetGameStart(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		if _, found := persistence.NewTournamentRepository(db).Find(id); found {
			c.Status(http.StatusNoContent)
			gameEventPublisher.Publish(id, &GameStartEventRepresentation{Id: id})
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		}
	}
}

// GetGameEvents creats web socket with tournamnent game events
// @Summary  Opens a web socket for tournamnent game start events
// @Tags     events
// @Produce  json-stream
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {object}  GameStartEventRepresentation
// @Router   /tournaments/{id}/events/game [get]
func GetGameEvents(param string) func(c *gin.Context) {
	return gameEventPublisher.Get(param)
}
