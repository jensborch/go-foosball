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

// EventPublisher manages WebSocket connections for real-time event broadcasting.
// Supports multiple clients per tournament ID.
type EventPublisher struct {
	sync.RWMutex
	websockets map[string]map[*websocket.Conn]bool
}

// Publish broadcasts data to all connected WebSocket clients for a given tournament ID.
func (e *EventPublisher) Publish(id string, data interface{}) {
	e.RLock()
	clients, exists := e.websockets[id]
	if !exists || len(clients) == 0 {
		e.RUnlock()
		return
	}
	// Copy clients to avoid holding lock during writes
	clientsCopy := make([]*websocket.Conn, 0, len(clients))
	for conn := range clients {
		clientsCopy = append(clientsCopy, conn)
	}
	e.RUnlock()

	// Send to all clients, track failed connections
	var failedConns []*websocket.Conn
	for _, conn := range clientsCopy {
		if err := conn.WriteJSON(data); err != nil {
			log.Printf("Failed to write to websocket: %+v", err)
			failedConns = append(failedConns, conn)
		}
	}

	// Clean up failed connections
	for _, conn := range failedConns {
		e.Unregister(id, conn)
		conn.Close()
	}
}

// Register adds a WebSocket connection for a tournament ID.
func (e *EventPublisher) Register(id string, conn *websocket.Conn) {
	e.Lock()
	defer e.Unlock()
	if e.websockets[id] == nil {
		e.websockets[id] = make(map[*websocket.Conn]bool)
	}
	e.websockets[id][conn] = true
	log.Printf("WebSocket client registered for tournament %s (total: %d)", id, len(e.websockets[id]))
}

// Unregister removes a WebSocket connection for a tournament ID.
func (e *EventPublisher) Unregister(id string, conn *websocket.Conn) {
	e.Lock()
	defer e.Unlock()
	if clients, exists := e.websockets[id]; exists {
		delete(clients, conn)
		log.Printf("WebSocket client unregistered for tournament %s (remaining: %d)", id, len(clients))
		// Clean up empty maps
		if len(clients) == 0 {
			delete(e.websockets, id)
		}
	}
}

// Get returns a Gin handler that upgrades HTTP connections to WebSocket
// and manages the connection lifecycle.
func (e *EventPublisher) Get(param string) func(c *gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Printf("Failed to set websocket upgrade: %+v", err)
			return
		}
		e.Register(id, conn)
		// Keep connection alive and listen for close
		for {
			if _, _, err := conn.NextReader(); err != nil {
				conn.Close()
				e.Unregister(id, conn)
				break
			}
		}
	}
}

// NewEventPublisher creates a new EventPublisher instance.
func NewEventPublisher() *EventPublisher {
	return &EventPublisher{
		websockets: make(map[string]map[*websocket.Conn]bool),
	}
}
