package resources

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/gorilla/websocket"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
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
		id := c.Param(param)
		defer HandlePanic(c)
		r := persistence.NewTournamentRepository(db)
		if t, found, err := r.Find(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
			return
		} else if err == nil {
			c.JSON(http.StatusOK, t)
		} else {
			panic(err)
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
		r := persistence.NewTournamentRepository(db)
		c.JSON(http.StatusOK, r.FindAll())
	}
}

//PlayerRepresenatation represents a player in a tournament
type PlayerRepresenatation struct {
	Nickname string `json:"nickname"`
	RealName string `json:"realname"`
	RFID     string `json:"rfid,omitempty"`
	Active   bool   `json:"active"`
	Ranking  uint   `json:"ranking,omitempty"`
}

func NewPlayerRepresentation(tp *model.TournamentPlayer) PlayerRepresenatation {
	return PlayerRepresenatation{
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
// @Success      200      {array}   PlayerRepresenatation
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/players [get]
func GetTournamentPlayes(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		defer HandlePanic(c)
		if players, found, err := persistence.NewTournamentRepository(db).FindAllPlayers(id); err == nil && found {
			c.JSON(http.StatusOK, players)
		} else if err != nil {
			panic(err)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		}
	}
}

type TournamentCreateRepresentation struct {
	Name           string `json:"name" binding:"required" gorm:"type:varchar(100)"`
	GameScore      uint   `json:"score" binding:"required"`
	InitialRanking uint   `json:"initial" binding:"required"`
}

// PostTournament creats tournament
// @Summary      Create tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        tournament  body      TournamentCreateRepresentation  true  "The tournament"
// @Success      200         {object}  model.Tournament
// @Failure      400         {object}  ErrorResponse
// @Failure      500         {object}  ErrorResponse
// @Router       /tournaments [post]
func PostTournament(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var tournament TournamentCreateRepresentation
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
		if err := r.Store(t); err != nil {
			panic(err)
		} else {
			c.JSON(http.StatusOK, t)
		}
	}
}

// PlayerInTournamentRepresenatation for adding players to tournament
type AddPlayer2TournamentRepresenatation struct {
	Nickname string `json:"nickname" binding:"required"`
	Ranking  uint   `json:"ranking"`
}

// PostTournamentPlayer addes player to a tournament
// @Summary      Add player to tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Param        player   body      AddPlayer2TournamentRepresenatation  true  "The tournament"
// @Success      200      {object}  PlayerRepresenatation
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/players [post]
func PostTournamentPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var pr AddPlayer2TournamentRepresenatation
		if err := c.ShouldBindWith(&pr, binding.JSON); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		tourRepo := persistence.NewTournamentRepository(tx)
		playerRepo := persistence.NewPlayerRepository(tx)
		if p, found, err := playerRepo.Find(pr.Nickname); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find player %s", pr.Nickname)))
		} else if err != nil {
			panic(err)
		} else {
			if pr.Ranking == 0 {
				if found, err := tourRepo.AddPlayer(id, p); err == nil && found {
					if result, found, err := tourRepo.FindPlayer(id, p.Nickname); err == nil && found {
						c.JSON(http.StatusOK, result)
					} else {
						panic(err)
					}
				} else {
					panic(err)
				}
			} else {
				if found, err := tourRepo.AddPlayerWithRanking(id, p, pr.Ranking); err == nil && found {
					if result, found, err := tourRepo.FindPlayer(id, p.Nickname); err == nil && found {
						c.JSON(http.StatusOK, result)
					} else {
						panic(err)
					}
				} else {
					panic(err)
				}
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
		if t, found, err := r.Find(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		} else if err != nil {
			panic(err)
		} else {
			r.Remove(t)
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
		tID := c.Param(tournamentParam)
		nickname := c.Param(playerParam)
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewTournamentRepository(tx)
		if found, err := r.DeactivatePlayer(tID, nickname); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", tID)))
		} else if err != nil {
			panic(err)
		} else {
			if tp, found, err := r.FindPlayer(tID, nickname); !found || err != nil {
				panic(err)
			} else {
				pr := NewPlayerRepresentation(tp)
				pEvents.publish(tID, pr)
				c.Status(http.StatusNoContent)
			}
		}
	}
}

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type playerEvents struct {
	sync.RWMutex
	websockets map[string]*websocket.Conn
}

func (e *playerEvents) publish(uuid string, player PlayerRepresenatation) {
	e.Lock()
	if e.websockets[uuid] != nil {
		e.websockets[uuid].WriteJSON(player)
	}
	e.Unlock()
}

func (e *playerEvents) register(uuid string, conn *websocket.Conn) {
	e.Lock()
	e.websockets[uuid] = conn
	e.Unlock()
}

func (e *playerEvents) unregister(uuid string) {
	e.Lock()
	delete(e.websockets, uuid)
	e.Unlock()
}

var pEvents = &playerEvents{
	websockets: make(map[string]*websocket.Conn),
}

// GetTournamentEvents creats web socket with tournamnent player events
// @Summary      Opens a web socket for tournamnent player event
// @Tags         tournament
// @Produce      json-stream
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {object}  PlayerRepresenatation
// @Failure      400      {string}  string
// @Router       /tournaments/{id}/events [get]
func GetTournamentEvents(param string) func(c *gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Printf("Failed to set websocket upgrade: %+v", err)
			return
		}
		pEvents.register(id, conn)
		for {
			if _, _, err := conn.NextReader(); err != nil {
				conn.Close()
				pEvents.unregister(id)
				break
			}
		}
	}
}
