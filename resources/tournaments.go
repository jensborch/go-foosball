package resources

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"gorm.io/gorm"
)

// GetTournament gets info about a tournament
// @Summary  Get tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {object}  model.Tournament
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id} [get]
func GetTournament(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		r := persistence.NewTournamentRepository(db)
		if t, found := r.Find(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		} else {
			c.JSON(http.StatusOK, t)
		}
	}
}

// GetTournaments gets a list of all tournaments
// @Summary  Get all tournaments
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Success  200  {array}  model.Tournament
// @Router   /tournaments [get]
func GetTournaments(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		r := persistence.NewTournamentRepository(db)
		c.JSON(http.StatusOK, r.FindAll())
	}
}

//TournamentPlayerRepresenatation represents a player in a tournament
type TournamentPlayerRepresenatation struct {
	Nickname string `json:"nickname" binding:"required"`
	RealName string `json:"realname"`
	RFID     string `json:"rfid,omitempty"`
	Active   bool   `json:"active" binding:"required"`
	Ranking  uint   `json:"ranking,omitempty"`
} //@name TournamentPlayer

func NewPlayerRepresentation(tp *model.TournamentPlayer) TournamentPlayerRepresenatation {
	return TournamentPlayerRepresenatation{
		Nickname: tp.Player.Nickname,
		RealName: tp.Player.RealName,
		RFID:     tp.Player.RFID,
		Active:   tp.Active,
		Ranking:  tp.Ranking,
	}
}

// GetTournamentPlayes get players in a given tournament
// @Summary  Get players in tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {array}   TournamentPlayerRepresenatation
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/players [get]
func GetTournamentPlayes(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		if players, found := persistence.NewTournamentRepository(db).FindAllActivePlayers(id); found {
			result := make([]TournamentPlayerRepresenatation, len(players))
			for i, p := range players {
				result[i] = NewPlayerRepresentation(p)
			}
			c.JSON(http.StatusOK, result)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		}
	}
}

type CreateTournamentRequest struct {
	Name           string `json:"name" binding:"required"`
	GameScore      uint   `json:"score"`
	InitialRanking uint   `json:"initial"`
} //@name CreateTournament

// PostTournament creats tournament
// @Summary  Create tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    tournament  body      CreateTournamentRequest  true  "The tournament"
// @Success  200         {object}  model.Tournament
// @Failure  400         {object}  ErrorResponse
// @Failure  500         {object}  ErrorResponse
// @Router   /tournaments [post]
func PostTournament(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var tournament CreateTournamentRequest
		if err := c.ShouldBindJSON(&tournament); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewTournamentRepository(tx)
		t := model.NewTournament(tournament.Name)
		t.GameScore = tournament.GameScore
		t.InitialRanking = tournament.InitialRanking
		r.Store(t)
		c.JSON(http.StatusOK, t)
	}
}

type AddPlayerRequest struct {
	Nickname string `json:"nickname" binding:"required"`
	Ranking  uint   `json:"ranking"`
} //@name AddPlayer

// PostTournamentPlayer addes player to a tournament
// @Summary  Add player to tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id      path      string            true  "Tournament ID"
// @Param    player  body      AddPlayerRequest  true  "The tournament"
// @Success  200     {object}  TournamentPlayerRepresenatation
// @Failure  400     {object}  ErrorResponse
// @Failure  404     {object}  ErrorResponse
// @Failure  500     {object}  ErrorResponse
// @Router   /tournaments/{id}/players [post]
func PostTournamentPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var pr AddPlayerRequest
		if err := c.ShouldBindJSON(&pr); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		tourRepo := persistence.NewTournamentRepository(tx)
		playerRepo := persistence.NewPlayerRepository(tx)
		if p, found := playerRepo.Find(pr.Nickname); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find player %s", pr.Nickname)))
		} else {
			if tp, found := tourRepo.ActivatePlayer(id, p.Nickname); found {
				c.JSON(http.StatusOK, tp)
				playerEventPublisher.Publish(id, NewPlayerRepresentation(tp))
			} else {
				addPlayer := func() (*model.TournamentPlayer, model.Found) {
					if pr.Ranking == 0 {
						tp, found := tourRepo.AddPlayer(id, p)
						return tp, found
					} else {
						tp, found := tourRepo.AddPlayerWithRanking(id, p, pr.Ranking)
						return tp, found
					}
				}
				if tp, found := addPlayer(); found {
					c.JSON(http.StatusOK, tp)
					playerEventPublisher.Publish(id, NewPlayerRepresentation(tp))
				} else {
					c.JSON(http.StatusNotFound, fmt.Sprintf("Could not finde tournament %s", id))
				}
			}
		}
	}
}

// DeleteTournament removes a tournament
// @Summary  Remove tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id  path  string  true  "Tournament ID"
// @Success  204
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id} [delete]
func DeleteTournament(tournamentParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(tournamentParam)
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewTournamentRepository(tx)
		if found := r.Remove(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		} else {
			c.Status(http.StatusNoContent)
		}
	}
}

// DeleteTournamentPlayer removes player from a tournament
// @Summary  Remove player from tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id      path  string  true  "Tournament ID"
// @Param    player  path  string  true  "Player ID"
// @Success  204
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/players/{player} [delete]
func DeleteTournamentPlayer(tournamentParam string, playerParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(tournamentParam)
		nickname := c.Param(playerParam)
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewTournamentRepository(tx)
		if tp, found := r.DeactivatePlayer(id, nickname); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		} else {
			pr := NewPlayerRepresentation(tp)
			playerEventPublisher.Publish(id, pr)
			c.Status(http.StatusNoContent)
		}
	}
}

var playerEventPublisher = NewEventPublisher()

// GetPlayerEvents creats web socket with tournamnent player events
// @Summary  Opens a web socket for tournamnent player events
// @Tags     events
// @Produce  json-stream
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {object}  TournamentPlayerRepresenatation
// @Router   /tournaments/{id}/events/player [get]
func GetPlayerEvents(param string) func(c *gin.Context) {
	return playerEventPublisher.Get(param)
}

// GetTournamentPlayeHistory get player ranking history in a given tournament
// @Summary  Get player ranking history in tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id        path      string  true  "Tournament ID"
// @Param    nickanme  path      string  true  "Player nickname"
// @Param    from      query     string  true  "The RFC3339 date to get history from"  Format(date)
// @Success  200       {array}   model.TournamentPlayerHistory
// @Failure  404       {object}  ErrorResponse
// @Failure  500       {object}  ErrorResponse
// @Router   /tournaments/{id}/players/{nickname}/history [get]
func GetTournamentPlayeHistory(tournamentParam string, playerParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(tournamentParam)
		nickname := c.Param(playerParam)
		if from, found := c.GetQuery("from"); found {
			if time, err := time.Parse("2006-01-02", from); err != nil {
				c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Error parsing from date: %s", err)))
			} else {
				if history, found := persistence.NewTournamentRepository(db).PlayerHistory(id, nickname, time); found {
					c.JSON(http.StatusOK, history)
				} else {
					c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s or player %s", id, nickname)))
				}
			}
		} else {
			c.JSON(http.StatusBadRequest, NewErrorResponse("A from date must be specified"))
		}
	}
}
