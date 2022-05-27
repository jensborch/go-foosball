package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"gorm.io/gorm"
)

// GetTournament gets info about a tournament
// @Summary      Get tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {object}  model.Tournament
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id} [get]
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
// @Summary      Get all tournaments
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Success      200      {array}   model.Tournament
// @Router       /tournaments [get]
func GetTournaments(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		r := persistence.NewTournamentRepository(db)
		c.JSON(http.StatusOK, r.FindAll())
	}
}

//TournamentPlayerRepresenatation represents a player in a tournament
type TournamentPlayerRepresenatation struct {
	Nickname string `json:"nickname"`
	RealName string `json:"realname"`
	RFID     string `json:"rfid,omitempty"`
	Active   bool   `json:"active"`
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
// @Summary      Get players in tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {array}   TournamentPlayerRepresenatation
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/players [get]
func GetTournamentPlayes(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		if players, found := persistence.NewTournamentRepository(db).FindAllActivePlayers(id); found {
			c.JSON(http.StatusOK, players)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		}
	}
}

type CreateTournamentRequest struct {
	Name           string `json:"name" binding:"required" gorm:"type:varchar(100)"`
	GameScore      uint   `json:"score" binding:"required"`
	InitialRanking uint   `json:"initial" binding:"required"`
} //@name CreateTournament

// PostTournament creats tournament
// @Summary      Create tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        tournament  body      CreateTournamentRequest  true  "The tournament"
// @Success      200         {object}  model.Tournament
// @Failure      400         {object}  ErrorResponse
// @Failure      500         {object}  ErrorResponse
// @Router       /tournaments [post]
func PostTournament(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var tournament CreateTournamentRequest
		if err := c.ShouldBindWith(&tournament, binding.JSON); err != nil {
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
// @Summary      Add player to tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Param        player   body      AddPlayerRequest  true  "The tournament"
// @Success      200      {object}  TournamentPlayerRepresenatation
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/players [post]
func PostTournamentPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var pr AddPlayerRequest
		if err := c.ShouldBindWith(&pr, binding.JSON); err != nil {
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

// DeleteTournament removes a tournament
// @Summary      Remove tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Success      204
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id} [delete]
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
// @Summary      Remove player from tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Param        player   path      string  true  "Player ID"
// @Success      204
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/players/{player} [delete]
func DeleteTournamentPlayer(tournamentParam string, playerParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(tournamentParam)
		nickname := c.Param(playerParam)
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewTournamentRepository(tx)
		if found := r.DeactivatePlayer(id, nickname); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		} else {
			tp, _ := r.FindPlayer(id, nickname)
			pr := NewPlayerRepresentation(tp)
			playerEventPublisher.Publish(id, pr)
			c.Status(http.StatusNoContent)
		}
	}
}

var playerEventPublisher = NewEventPublisher()

// GetPlayerEvents creats web socket with tournamnent player events
// @Summary      Opens a web socket for tournamnent player events
// @Tags         events
// @Produce      json-stream
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {object}  TournamentPlayerRepresenatation
// @Router       /tournaments/{id}/events/player [get]
func GetPlayerEvents(param string) func(c *gin.Context) {
	return playerEventPublisher.Get(param)
}
