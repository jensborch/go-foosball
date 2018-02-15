package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Playable game
type Playable interface {
	Right() []*Player
	Left() []*Player
}

// Game played
type Game struct {
	gorm.Model
	UUID              string `gorm:"size:36;unique_index"`
	TournamentTableID uint
	TournamentTable   *TournamentTable
	RightPlayerOneID  uint
	RightPlayerTwoID  uint
	LeftPlayerOneID   uint
	LeftPlayerTwoID   uint
	RightPlayerOne    *Player
	RightPlayerTwo    *Player
	LeftPlayerOne     *Player
	LeftPlayerTwo     *Player
}

// Right return right playes
func (g Game) Right() []*Player {
	var players []*Player
	if g.RightPlayerTwo == nil {
		players = make([]*Player, 1)
		players[0] = g.RightPlayerOne
	} else {
		players = make([]*Player, 2)
		players[0] = g.RightPlayerOne
		players[1] = g.RightPlayerTwo
	}
	return players
}

// Left return left playes
func (g Game) Left() []*Player {
	var players []*Player
	if g.LeftPlayerTwo == nil {
		players = make([]*Player, 1)
		players[0] = g.LeftPlayerOne
	} else {
		players = make([]*Player, 2)
		players[0] = g.LeftPlayerOne
		players[1] = g.LeftPlayerTwo
	}
	return players
}

// PlayerPair pair of playes playing a doubles game
type PlayerPair struct {
	First  *Player
	Second *Player
}

// GameRepository provides access games etc.
type GameRepository interface {
	Store(game *Game) error
	Find(uuid string) (*Game, error)
	FindAll() []*Game
}

// NewDuroGame creates a new game
func NewDuroGame(table *TournamentTable, right PlayerPair, left PlayerPair) *Game {
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
func NewSinglesGame(table *TournamentTable, right *Player, left *Player) *Game {
	id := uuid.Must(uuid.NewV4()).String()
	return &Game{
		UUID:            id,
		TournamentTable: table,
		RightPlayerOne:  right,
		LeftPlayerOne:   left,
	}
}
