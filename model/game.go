package model

import (
	"github.com/satori/go.uuid"
)

// Game played
type Game interface {
	Right() []*Player
	Left() []*Player
}

// AbstractGame for shared game functionality
type game struct {
	GameID uuid.UUID
	Table  *TournamentTable
}

// SinglesGame to play
type SinglesGame struct {
	game
	right *Player
	left  *Player
}

// Right return right playes
func (s DoublesGame) Right() []*Player {
	players := make([]*Player, 2)
	players[0] = s.right.First
	players[1] = s.right.Second
	return players
}

// Left return left playes
func (s DoublesGame) Left() []*Player {
	players := make([]*Player, 2)
	players[0] = s.left.First
	players[1] = s.left.Second
	return players
}

// DoublesGame to play
type DoublesGame struct {
	game
	right PlayerPair
	left  PlayerPair
}

// PlayerPair pair of playes playing a doubles game
type PlayerPair struct {
	First  *Player
	Second *Player
}

// Right return right playes
func (s SinglesGame) Right() []*Player {
	players := make([]*Player, 1)
	players[0] = s.right
	return players
}

// Left return left playes
func (s SinglesGame) Left() []*Player {
	players := make([]*Player, 1)
	players[0] = s.left
	return players
}

// Repository provides access games etc.
type Repository interface {
	Store(game *Game) error
	Find(id uuid.UUID) (*Game, error)
	FindAll() []*Game
}

// NewSinglesGame creates a new game
func NewSinglesGame(table *TournamentTable, right *Player, left *Player) Game {
	id := uuid.Must(uuid.NewV4())
	return &SinglesGame{
		game: game{
			GameID: id,
			Table:  table,
		},
		right: right,
		left:  left,
	}
}
