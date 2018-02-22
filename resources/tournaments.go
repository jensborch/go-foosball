package resources

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
)

// GetTournament gets info about a tournament
func GetTournament(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewTournamentRepository(db)
		t, found, err := r.Find(id)
		if found {
			c.JSON(http.StatusOK, t)
		} else if err == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", id)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	}
}

// GetTournaments gets a list of all tournaments
func GetTournaments(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		r := persistence.NewTournamentRepository(db)
		c.JSON(http.StatusOK, r.FindAll())
	}
}

// GetTournamentPlayes get players in a given tournament
func GetTournamentPlayes(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewPlayerRepository(db)
		players := r.FindByTournament(id)
		c.JSON(http.StatusOK, players)
	}
}

// PostTournament creats tournament
func PostTournament(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var tournament model.Tournament
		if err := c.ShouldBindJSON(&tournament); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tx := db.Begin()
		r := persistence.NewTournamentRepository(tx)
		t := model.NewTournament(tournament.Name)
		t.GamePoints = tournament.GamePoints
		t.InitialPoints = tournament.InitialPoints
		if err := r.Store(t); err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		tx.Commit()
		c.JSON(http.StatusOK, t)
	}
}

// PostTournamentPlayer addes player to a tournament
func PostTournamentPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var (
			player model.Player
			err    error
			found  model.Found
			t      *model.Tournament
		)
		if err = c.ShouldBindJSON(&player); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tx := db.Begin()
		if t, found, err = persistence.NewTournamentRepository(tx).Find(id); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not tournament %s", t.Name)})
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
		p.AddToTournament(t)
		if err = playerRepo.Update(p); err != nil {
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
		pId := c.Param(playerParam)
		tx := db.Begin()
		r := persistence.NewPlayerRepository(tx)
		p, _, err := r.Find(pId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			tx.Rollback()
			return
		}
		found := false
		for i, tp := range p.TournamentPlayers {
			if tp.Tournament.UUID == tID {
				p.TournamentPlayers[i].Active = false
				r.Update(p)
				found = true
				pEvents.publish(tID, *p)
				c.JSON(http.StatusOK, p)
				break
			}
		}
		if found {
			tx.Commit()
		} else {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", tID)})
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
