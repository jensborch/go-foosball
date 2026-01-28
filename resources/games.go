package resources

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/jensborch/go-foosball/model"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/persistence"
)

// GetGamesInTournament find all games in tournament
// @Summary  Get all games in a tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id   path     string  true  "Tournament ID"
// @Success  200  {array}  model.GameJson
// @Router   /tournaments/{id}/games [get]
func GetGamesInTournament(param string) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		c.JSON(http.StatusOK, persistence.NewGameRepository(GetDB(c)).FindByTournament(id))
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
func GetRandomGames(param string) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewTournamentRepository(GetDB(c))
		if games, found := r.RandomGames(id); found {
			c.JSON(http.StatusOK, games)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
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
	for _, nickname := range players {
		player, found := repo.FindPlayer(tourId, nickname)
		if !found {
			return false
		}
		if err := add(player); err != nil {
			return false
		}
	}
	return true
}

// PostGame saves a played game result.
// @Summary  Submit game results
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id     path      string             true  "Tournament ID"
// @Param    table  path      string             true  "Table ID"
// @Param    game   body      GameResultRequest  true  "Submit game results"
// @Success  201    {object}  model.GameJson
// @Failure  400    {object}  ErrorResponse
// @Failure  404    {object}  ErrorResponse
// @Failure  500    {object}  ErrorResponse
// @Router   /tournaments/{id}/tables/{table}/games [post]
func PostGame(tournamentParam string, tableParam string) func(*gin.Context) {
	return func(c *gin.Context) {
		tourId := c.Param(tournamentParam)
		tableId := c.Param(tableParam)
		var gr GameResultRequest
		if err := c.ShouldBindJSON(&gr); err != nil {
			Abort(c, BadRequestError("%s", err.Error()))
			return
		}
		db := GetDB(c)
		tourRepo := persistence.NewTournamentRepository(db)
		table, found := tourRepo.FindTable(tourId, tableId)
		if !found {
			Abort(c, NotFoundError("Could not find table %s or tournament %s", tableId, tourId))
			return
		}
		game := model.NewGame(table)
		if found := addPlayers(tourId, gr.LeftPlayers, tourRepo, game.AddLeftTournamentPlayer) &&
			addPlayers(tourId, gr.RightPlayers, tourRepo, game.AddRightTournamentPlayer); !found {
			Abort(c, NotFoundError("Could not find at least one of the players in tournament %s", tourId))
			return
		}
		game.Winner = gr.Winner
		game.UpdateScore()
		persistence.NewGameRepository(db).Store(game)
		c.JSON(http.StatusCreated, game)
	}
}

// GetGame returns a game by ID.
// @Summary  Get game results
// @Tags     game
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Game ID"
// @Success  200  {object}  model.GameJson
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /games/{id} [get]
func GetGame(param string) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		if g, found := persistence.NewGameRepository(GetDB(c)).Find(id); found {
			c.JSON(http.StatusOK, g)
		} else {
			Abort(c, NotFoundError("Could not find game %s", id))
		}
	}
}

// GetGames returns all games played.
// @Summary  Get all game results
// @Tags     game
// @Accept   json
// @Produce  json
// @Success  200  {array}  model.GameJson
// @Router   /games [get]
func GetGames() func(*gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, persistence.NewGameRepository(GetDB(c)).FindAll())
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
func GetGameStart(param string) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		if _, found := persistence.NewTournamentRepository(GetDB(c)).Find(id); found {
			c.Status(http.StatusNoContent)
			gameEventPublisher.Publish(id, &GameStartEventRepresentation{Id: id})
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
		}
	}
}

// GetGameEvents creates a WebSocket connection for tournament game events.
// @Summary  Opens a WebSocket for tournament game start events
// @Tags     events
// @Produce  json-stream
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {object}  GameStartEventRepresentation
// @Router   /tournaments/{id}/events/game [get]
func GetGameEvents(param string) func(c *gin.Context) {
	return gameEventPublisher.Get(param)
}
