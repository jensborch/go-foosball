package model

import (
	"encoding/json"
	"errors"
	"reflect"

	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Game played
type Game struct {
	gorm.Model        `json:"-"`
	UUID              string          `gorm:"size:36;unique_index"`
	TournamentTableID uint            `json:"-"`
	TournamentTable   TournamentTable `json:"table"`
	RightPlayerOneID  uint            `json:"-"`
	RightPlayerTwoID  uint            `json:"-"`
	LeftPlayerOneID   uint            `json:"-"`
	LeftPlayerTwoID   uint            `json:"-"`
	RightPlayerOne    Player          `json:"-"`
	RightPlayerTwo    Player          `json:"-"`
	LeftPlayerOne     Player          `json:"-"`
	LeftPlayerTwo     Player          `json:"-"`
	Winner            Winner          `json:"winner"`
}

// MarshalJSON creates JSON game representation
func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		UUID   string   `json:"uuid"`
		Table  Table    `json:"table"`
		Right  []string `json:"right"`
		Left   []string `json:"left"`
		Winner Winner   `json:"winner,omitempty"`
	}{
		UUID:   g.UUID,
		Table:  g.TournamentTable.Table,
		Right:  g.RightPlayerNames(),
		Left:   g.LeftPlayerNames(),
		Winner: g.Winner,
	})
}

// Winner of a game played
type Winner string

const (
	//RIGHT is winner
	RIGHT Winner = "right"

	//LEFT is winner
	LEFT = "left"
)

// Right return right playes
func (g Game) Right() []Player {
	var players []Player
	if isEmptyPlayer(g.RightPlayerTwo) {
		players = make([]Player, 1)
		players[0] = g.RightPlayerOne
	} else {
		players = make([]Player, 2)
		players[0] = g.RightPlayerOne
		players[1] = g.RightPlayerTwo
	}
	return players
}

// RightPlayerNames return right player names
func (g Game) RightPlayerNames() []string {
	result := make([]string, 0, 2)
	for _, n := range g.Right() {
		result = append(result, n.Nickname)
	}
	return result
}

// Left return left playes
func (g Game) Left() []Player {
	var players []Player
	if isEmptyPlayer(g.LeftPlayerTwo) {
		players = make([]Player, 1)
		players[0] = g.LeftPlayerOne
	} else {
		players = make([]Player, 2)
		players[0] = g.LeftPlayerOne
		players[1] = g.LeftPlayerTwo
	}
	return players
}

// LeftPlayerNames return right player names
func (g Game) LeftPlayerNames() []string {
	result := make([]string, 0, 2)
	for _, n := range g.Left() {
		result = append(result, n.Nickname)
	}
	return result
}

func isEmptyPlayer(p Player) bool {
	return reflect.DeepEqual(p, Player{})
}

// AddPlayer adds a player to a game
func (g *Game) AddPlayer(p Player) error {
	switch {
	case isEmptyPlayer(g.RightPlayerOne):
		g.RightPlayerOne = p
	case isEmptyPlayer(g.LeftPlayerOne):
		g.LeftPlayerOne = p
	case isEmptyPlayer(g.RightPlayerTwo):
		g.RightPlayerTwo = p
	case isEmptyPlayer(g.LeftPlayerTwo):
		g.LeftPlayerTwo = p
	default:
		return errors.New("All players have been added")
	}
	return nil
}

// GameRepository provides access games etc.
type GameRepository interface {
	Store(game *Game) error
	Find(uuid string) (*Game, Found, error)
	FindAll() []*Game
	FindByTournament(uuid string) []*Game
}

// NewGame creates a new game
func NewGame(table TournamentTable) *Game {
	id := uuid.Must(uuid.NewV4(), nil).String()
	return &Game{
		UUID:            id,
		TournamentTable: table,
	}
}
