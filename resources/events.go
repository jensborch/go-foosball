package resources

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type EventPublisher struct {
	sync.RWMutex
	websockets map[string]*websocket.Conn
}

func (e *EventPublisher) Publish(id string, data interface{}) {
	e.Lock()
	if e.websockets[id] != nil {
		e.websockets[id].WriteJSON(data)
	}
	e.Unlock()
}

func (e *EventPublisher) Register(id string, conn *websocket.Conn) {
	e.Lock()
	e.websockets[id] = conn
	e.Unlock()
}

func (e *EventPublisher) Unregister(id string) {
	e.Lock()
	delete(e.websockets, id)
	e.Unlock()
}

func (e *EventPublisher) Get(param string) func(c *gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Printf("Failed to set websocket upgrade: %+v", err)
			return
		}
		e.Register(id, conn)
		for {
			if _, _, err := conn.NextReader(); err != nil {
				conn.Close()
				e.Unregister(id)
				break
			}
		}
	}
}

func NewEventPublisher() *EventPublisher {
	return &EventPublisher{
		websockets: make(map[string]*websocket.Conn),
	}
}
