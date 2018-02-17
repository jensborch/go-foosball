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

// GetTournament get players resource
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

// GetTournaments to list all tournaments
func GetTournaments(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		r := persistence.NewTournamentRepository(db)
		c.JSON(http.StatusOK, r.FindAll())
	}
}

// GetTournamentPlayes get players resource
func GetTournamentPlayes(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewTournamentRepository(db)
		t, found, err := r.Find(id)
		if found {
			c.JSON(http.StatusOK, t.Players)
		} else if err == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", id)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	}
}

// PostTournament creats tournament
func PostTournament(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var tournament model.Tournament
		if err := c.ShouldBindJSON(&tournament); err == nil {
			tx := db.Begin()
			r := persistence.NewTournamentRepository(tx)
			t := model.NewTournament(tournament.Name)
			err := r.Store(t)
			if err == nil {
				tx.Commit()
				c.JSON(http.StatusOK, t)
			} else {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	}
}

// PostTournamentPlayer creats tournament
func PostTournamentPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var (
			player model.Player
			err    error
		)
		if err = c.ShouldBindJSON(&player); err == nil {
			tx := db.Begin()
			var (
				found model.Found
				t     *model.Tournament
			)
			t, found, err = persistence.NewTournamentRepository(tx).Find(id)
			if found {
				r := persistence.NewPlayerRepository(tx)
				var p *model.Player
				p, found, err = r.Find(player.Nickname)
				if found {
					p.TournamentID = t.ID
					err = r.Update(p)
					p, _, err = r.Find(p.Nickname)
					if err == nil {
						pEvents.publish(t.UUID, *p)
						c.JSON(http.StatusOK, p)
					}
				} else {
					c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find player %s", p.Nickname)})
				}
			} else {
				c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", t.UUID)})
			}
			if err == nil {
				tx.Commit()
			} else {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

// GetTournamentEvents crestes web socket with tournamnent events
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
