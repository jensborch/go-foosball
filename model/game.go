package model

import (
	"github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	TableID uuid.UUID
	Tables  []TournamentTable
}

// TournamentTable in a foosball game
type TournamentTable struct {
	TableID uuid.UUID
	Table   Table
	Games   []Game
}

// Table used in tournament
type Table struct {
	TableID uuid.UUID
	Name    string
	Color   Color
}

// Color of table
type Color struct {
	Right string
	Left  string
}

// Game played
type Game interface {
	Right() []Player
	Left() []Player
}

// AbstractGame for shared game functionality
type game struct {
	GameID uuid.UUID
	Table  TournamentTable
}

// DoublesGame to play
type DoublesGame struct {
	game
	right PlayerPair
	left  PlayerPair
}

// SinglesGame to play
type SinglesGame struct {
	game
	right Player
	left  Player
}

// Right return right playes
func (s SinglesGame) Right() []Player {
	players := make([]Player, 1)
	players[0] = s.right
	return players
}

// Left return left playes
func (s SinglesGame) Left() []Player {
	players := make([]Player, 1)
	players[0] = s.left
	return players
}

// PlayerPair pair of playes playing a doubles game
type PlayerPair struct {
	First  Player
	Second Player
}

// Repository provides access games etc.
type Repository interface {
	Store(game *Game) error
	Find(id uuid.UUID) (*Game, error)
	FindAll() []*Game
}

// NewSinglesGame creates a new game
func NewSinglesGame() Game {
	id := uuid.Must(uuid.NewV4())
	return &SinglesGame{
		game: game{GameID: id},
	}
}
