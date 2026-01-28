package resources

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jensborch/go-foosball/service"
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
		id := c.Param(param)
		r := persistence.NewTournamentRepository(db)
		if t, found := r.Find(id); found {
			c.JSON(http.StatusOK, t)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
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
		r := persistence.NewTournamentRepository(db)
		c.JSON(http.StatusOK, r.FindAll())
	}
}

// TournamentPlayerRepresentation represents a player in a tournament
type TournamentPlayerRepresentation struct {
	Nickname string       `json:"nickname" binding:"required"`
	RealName string       `json:"realname"`
	RFID     string       `json:"rfid,omitempty"`
	Status   model.Status `json:"status" binding:"required" enums:"active,inactive,deleted"`
	Ranking  uint         `json:"ranking,omitempty"`
	Latest   *time.Time   `json:"latest,omitempty"`
} //@name TournamentPlayer

func NewPlayerRepresentation(tp *model.TournamentPlayer) TournamentPlayerRepresentation {
	return TournamentPlayerRepresentation{
		Nickname: tp.Player.Nickname,
		RealName: tp.Player.RealName,
		RFID:     tp.Player.RFID,
		Status:   tp.Status,
		Ranking:  tp.Ranking,
		Latest:   tp.Latest,
	}
}

// GetTournamentPlayers gets all players in a given tournament.
// @Summary  Get players in tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {array}   TournamentPlayerRepresentation
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/players [get]
func GetTournamentPlayers(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		if players, found := persistence.NewTournamentRepository(db).FindAllPlayers(id); found {
			result := make([]TournamentPlayerRepresentation, len(players))
			for i, p := range players {
				result[i] = NewPlayerRepresentation(p)
			}
			c.JSON(http.StatusOK, result)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
		}
	}
}

type CreateTournamentRequest struct {
	Name           string `json:"name" binding:"required"`
	GameScore      uint   `json:"score" binding:"required"`
	InitialRanking uint   `json:"initial"  binding:"required"`
	Timeout        uint   `json:"timeout"`
} //@name CreateTournament

// PostTournament creates a new tournament.
// @Summary  Create tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    tournament  body      CreateTournamentRequest  true  "The tournament"
// @Success  201         {object}  model.Tournament
// @Failure  400         {object}  ErrorResponse
// @Failure  500         {object}  ErrorResponse
// @Router   /tournaments [post]
func PostTournament(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var tournament CreateTournamentRequest
		if err := c.ShouldBindJSON(&tournament); err != nil {
			Abort(c, BadRequestError("%s", err.Error()))
			return
		}
		tx := GetTx(c)
		r := persistence.NewTournamentRepository(tx)
		t := model.NewTournament(tournament.Name)
		t.GameScore = tournament.GameScore
		t.InitialRanking = tournament.InitialRanking
		t.Timeout = tournament.Timeout
		r.Store(t)
		c.JSON(http.StatusCreated, t)
	}
}

type AddPlayerRequest struct {
	Nickname string `json:"nickname" binding:"required"`
	Ranking  uint   `json:"ranking"`
} //@name AddPlayer

// PostTournamentPlayer adds player to a tournament
// @Summary  Add player to tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id      path      string            true  "Tournament ID"
// @Param    player  body      AddPlayerRequest  true  "The tournament"
// @Success  201     {object}  TournamentPlayerRepresentation
// @Failure  400     {object}  ErrorResponse
// @Failure  404     {object}  ErrorResponse
// @Failure  500     {object}  ErrorResponse
// @Router   /tournaments/{id}/players [post]
func PostTournamentPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var pr AddPlayerRequest
		if err := c.ShouldBindJSON(&pr); err != nil {
			Abort(c, BadRequestError("%s", err.Error()))
			return
		}
		tx := GetTx(c)
		tourRepo := persistence.NewTournamentRepository(tx)
		playerRepo := persistence.NewPlayerRepository(tx)
		p, found := playerRepo.Find(pr.Nickname)
		if !found {
			Abort(c, NotFoundError("Could not find player %s", pr.Nickname))
			return
		}
		if tp, found := tourRepo.ActivatePlayer(id, p.Nickname); found {
			c.JSON(http.StatusCreated, tp)
			playerEventPublisher.Publish(id, NewPlayerRepresentation(tp))
			return
		}
		addPlayer := func() (*model.TournamentPlayer, model.Found) {
			if pr.Ranking == 0 {
				return tourRepo.AddPlayer(id, p)
			}
			return tourRepo.AddPlayerWithRanking(id, p, pr.Ranking)
		}
		if tp, found := addPlayer(); found {
			c.JSON(http.StatusCreated, tp)
			playerEventPublisher.Publish(id, NewPlayerRepresentation(tp))
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
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
		tx := GetTx(c)
		r := persistence.NewTournamentRepository(tx)
		if found := r.Remove(id); found {
			service.ClearGameRoundGenerator(id)
			c.Status(http.StatusNoContent)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
		}
	}
}

type TournamentPlayerStatusRequest struct {
	Status model.Status `json:"status" binding:"required" enums:"active,inactive,deleted"`
} //@name TournamentPlayerStatus

// UpdateTournamentPlayerStatus removes player from a tournament
// @Summary  Changes player status in tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id      path  string  true  "Tournament ID"
// @Param    player  path  string  true  "Player ID"
// @Param    status  body      TournamentPlayerStatusRequest  true  "Tournament player status"
// @Success  200     {object}  TournamentPlayerRepresentation
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/players/{player} [put]
func UpdateTournamentPlayerStatus(tournamentParam string, playerParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var status TournamentPlayerStatusRequest
		if err := c.ShouldBindJSON(&status); err != nil {
			Abort(c, BadRequestError("%s", err.Error()))
			return
		}
		id := c.Param(tournamentParam)
		nickname := c.Param(playerParam)
		tx := GetTx(c)
		r := persistence.NewTournamentRepository(tx)
		if tp, found := r.UpdatePlayerStatus(id, nickname, status.Status); found {
			service.ClearGameRoundGenerator(id)
			pr := NewPlayerRepresentation(tp)
			playerEventPublisher.Publish(id, pr)
			c.JSON(http.StatusOK, pr)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s or player %s", id, nickname))
		}
	}
}

// DeleteAllTournamentPlayers remove all players from a tournament
// @Summary  Remove all players from tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id      path  string  true  "Tournament ID"
// @Success  204
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/players [delete]
func DeleteAllTournamentPlayers(tournamentParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(tournamentParam)
		tx := GetTx(c)
		r := persistence.NewTournamentRepository(tx)
		if found := r.DeactivatePlayers(id); found {
			service.ClearGameRoundGenerator(id)
			c.Status(http.StatusNoContent)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
		}
	}
}

var playerEventPublisher = NewEventPublisher()

// GetPlayerEvents creates a WebSocket connection for tournament player events.
// @Summary  Opens a WebSocket for tournament player events
// @Tags     events
// @Produce  json-stream
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {object}  TournamentPlayerRepresentation
// @Router   /tournaments/{id}/events/player [get]
func GetPlayerEvents(param string) func(c *gin.Context) {
	return playerEventPublisher.Get(param)
}

// GetTournamentPlayerHistory gets player ranking history in a given tournament.
// @Summary  Get player ranking history in tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id        path      string  true  "Tournament ID"
// @Param    nickname  path      string  true  "Player nickname"
// @Param    from      query     string  true  "The RFC3339 date to get history from"  Format(date)
// @Success  200       {array}   model.TournamentPlayerHistory
// @Failure  404       {object}  ErrorResponse
// @Failure  500       {object}  ErrorResponse
// @Router   /tournaments/{id}/players/{nickname}/history [get]
func GetTournamentPlayerHistory(tournamentParam string, playerParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(tournamentParam)
		nickname := c.Param(playerParam)
		from, found := c.GetQuery("from")
		if !found {
			Abort(c, BadRequestError("A from date must be specified"))
			return
		}
		parsedTime, err := time.Parse("2006-01-02", from)
		if err != nil {
			Abort(c, BadRequestError("Error parsing from date: %s", err))
			return
		}
		if history, found := persistence.NewTournamentRepository(db).PlayerHistory(id, nickname, parsedTime); found {
			c.JSON(http.StatusOK, history)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s or player %s", id, nickname))
		}
	}
}

type TournamentHistoryRepresenatation struct {
	UpdatedAt time.Time `json:"updated" binding:"required"`
	Nickname  string    `json:"nickname" binding:"required"`
	RealName  string    `json:"realname"`
	Ranking   uint      `json:"ranking" binding:"required"`
} //@name TournamentHistory

func newTournamentHistory(history *model.TournamentPlayerHistory) *TournamentHistoryRepresenatation {
	return &TournamentHistoryRepresenatation{
		UpdatedAt: history.UpdatedAt,
		Nickname:  history.TournamentPlayer.Player.Nickname,
		RealName:  history.TournamentPlayer.Player.RealName,
		Ranking:   history.Ranking,
	}
}

// GetTournamentHistory get ranking history for a given tournament
// @Summary  Get ranking history for a tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id        path      string  true  "Tournament ID"
// @Param    from      query     string  true  "The RFC3339 date to get history from"  Format(date)
// @Success  200       {array}   TournamentHistoryRepresenatation
// @Failure  404       {object}  ErrorResponse
// @Failure  500       {object}  ErrorResponse
// @Router   /tournaments/{id}/history [get]
func GetTournamentHistory(tournamentParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(tournamentParam)
		from, found := c.GetQuery("from")
		if !found {
			Abort(c, BadRequestError("A from date must be specified"))
			return
		}
		parsedTime, err := time.Parse("2006-01-02", from)
		if err != nil {
			Abort(c, BadRequestError("Error parsing from date: %s", err))
			return
		}
		if history, found := persistence.NewTournamentRepository(db).History(id, parsedTime); found {
			result := make([]TournamentHistoryRepresenatation, len(history))
			for i, h := range history {
				result[i] = *newTournamentHistory(h)
			}
			c.JSON(http.StatusOK, result)
		} else {
			Abort(c, NotFoundError("Could not find tournament %s", id))
		}
	}
}
