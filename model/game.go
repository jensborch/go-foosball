package model

import (
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
	RightPlayerOne    Player          `json:"tightPlayerOne"`
	RightPlayerTwo    Player          `json:"rightPlayerTwo,  omitempty"`
	LeftPlayerOne     Player          `json:"leftPlayerOne"`
	LeftPlayerTwo     Player          `json:"leftPlayerTwo, omitempty"`
	Winner            Winner          `json:"winner"`
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
	if reflect.DeepEqual(g.RightPlayerTwo, Player{}) {
		players = make([]Player, 1)
		players[0] = g.RightPlayerOne
	} else {
		players = make([]Player, 2)
		players[0] = g.RightPlayerOne
		players[1] = g.RightPlayerTwo
	}
	return players
}

// Left return left playes
func (g Game) Left() []Player {
	var players []Player
	if reflect.DeepEqual(g.LeftPlayerTwo, Player{}) {
		players = make([]Player, 1)
		players[0] = g.LeftPlayerOne
	} else {
		players = make([]Player, 2)
		players[0] = g.LeftPlayerOne
		players[1] = g.LeftPlayerTwo
	}
	return players
}

// PlayerPair pair of playes playing a doubles game
type PlayerPair struct {
	First  Player
	Second Player
}

// GameRepository provides access games etc.
type GameRepository interface {
	Store(game *Game) error
	Find(uuid string) (*Game, error)
	FindAll() []*Game
}

// NewDuroGame creates a new game
func NewDuroGame(table TournamentTable, right PlayerPair, left PlayerPair) *Game {
	id := uuid.Must(uuid.NewV4()).String()
	return &Game{
		UUID:            id,
		TournamentTable: table,
		RightPlayerOne:  right.First,
		LeftPlayerOne:   left.First,
		RightPlayerTwo:  right.Second,
		LeftPlayerTwo:   left.Second,
	}
}

// NewSinglesGame creates a new game
func NewSinglesGame(table TournamentTable, right Player, left Player) *Game {
	id := uuid.Must(uuid.NewV4()).String()
	return &Game{
		UUID:            id,
		TournamentTable: table,
		RightPlayerOne:  right,
		LeftPlayerOne:   left,
	}
}
