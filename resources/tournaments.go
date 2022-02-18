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
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {array}   model.Tournament
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id} [get]
func GetTournament(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewTournamentRepository(db)
		if t, found, err := r.Find(id); found {
			c.JSON(http.StatusOK, t)
			return
		} else if err != nil {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
			return
		} else {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			return
		}
	}
}

// GetTournaments gets a list of all tournaments
// @Summary      Get all tournaments
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
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
	Ranking  uint   `json:"ranking"`
}

// GetTournamentPlayes get players in a given tournament
// @Summary      Get players in tournament
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
		if _, found, _ := persistence.NewTournamentRepository(db).Find(id); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", id)})
			return
		}
		foundPlayers := persistence.NewPlayerRepository(db).FindByTournament(id)
		players := make([]PlayerRepresenatation, len(foundPlayers))
		for i, p := range foundPlayers {
			var ranking uint
			if r, e := p.GetScore(id); e == nil {
				ranking = r
			}
			players[i] = PlayerRepresenatation{
				Nickname: p.Nickname,
				RealName: p.RealName,
				RFID:     p.RFID,
				Active:   p.IsActive(id),
				Ranking:  ranking,
			}
		}
		c.JSON(http.StatusOK, players)
	}
}

type TournamentRepresentation struct {
	Name           string `json:"name" binding:"required" gorm:"type:varchar(100)"`
	GameScore      uint   `json:"score" binding:"required"`
	InitialRanking uint   `json:"initial" binding:"required"`
}

// PostTournament creats tournament
func PostTournament(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var tournament TournamentRepresentation
		if err := c.ShouldBindWith(&tournament, binding.JSON); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tx := db.Begin()
		r := persistence.NewTournamentRepository(tx)
		t := model.NewTournament(tournament.Name)
		t.GameScore = tournament.GameScore
		t.InitialRanking = tournament.InitialRanking
		if err := r.Store(t); err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		tx.Commit()
		c.JSON(http.StatusOK, t)
	}
}

// PlayerInTournamentRepresenatation for adding players to tournament
type PlayerInTournamentRepresenatation struct {
	Nickname string `json:"nickname" binding:"required"`
	Ranking  uint   `json:"ranking"`
}

// PostTournamentPlayer addes player to a tournament
func PostTournamentPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var (
			player PlayerInTournamentRepresenatation
			err    error
			found  model.Found
			t      *model.Tournament
		)
		if err = c.ShouldBindWith(&player, binding.JSON); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tx := db.Begin()
		tournamentRepo := persistence.NewTournamentRepository(tx)
		if t, found, err = tournamentRepo.Find(id); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", id)})
			tx.Rollback()
			return
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			tx.Rollback()
			return
		}
		playerRepo := persistence.NewPlayerRepository(tx)
		var p *model.Player
		if p, found, err = playerRepo.Find(player.Nickname); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find player %s", player.Nickname)})
			tx.Rollback()
			return
		}
		if player.Ranking == 0 {
			t.AddPlayer(p)
		} else {
			t.AddPlayerWithRanking(p, player.Ranking)
		}
		if err = tournamentRepo.Update(t); err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not update player %s", player.Nickname)})
			tx.Rollback()
			return
		}
		if p, _, err = playerRepo.Find(p.Nickname); err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find player %s after update", player.Nickname)})
			tx.Rollback()
			return
		}
		pEvents.publish(t.UUID, *p)
		tx.Commit()
		c.JSON(http.StatusOK, p)
	}
}

// DeleteTournamentPlayer removes player from a tournament
func DeleteTournamentPlayer(tournamentParam string, playerParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		tID := c.Param(tournamentParam)
		pID := c.Param(playerParam)
		tx := db.Begin()
		r := persistence.NewTournamentRepository(tx)
		if t, found, err := r.Find(tID); !found {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", tID)})
		} else if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		} else {
			log.Printf("Deactivation player %s in tournament %s", pID, tID)
			if found := t.DeactivatePlayer(pID); found {
				if err := r.Update(t); err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				if p, found, err := persistence.NewPlayerRepository(tx).Find(pID); !found || err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error finding player %s after update", pID)})
				} else {
					tx.Commit()
					pEvents.publish(tID, *p)
					c.JSON(http.StatusOK, p)
				}
			} else {
				tx.Rollback()
				c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find player %s", pID)})
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

func (e *playerEvents) publish(uuid string, player model.Player) {
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

// GetTournamentEvents creats web socket with tournamnent events
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
