package model

import (
	"github.com/satori/go.uuid"
)

// Game played
type Game interface {
	ID() uuid.UUID
	Right() []*Player
	Left() []*Player
	TournamentTable() *TournamentTable
}

// AbstractGame for shared game functionality
type game struct {
	gameID uuid.UUID
	table  *TournamentTable
}

func (g game) TournamentTable() *TournamentTable {
	return g.table
}

func (g game) ID() uuid.UUID {
	return g.gameID
}

// SinglesGame to play
type singlesGame struct {
	game
	right *Player
	left  *Player
}

// Right return right playes
func (s singlesGame) Right() []*Player {
	players := make([]*Player, 1)
	players[0] = s.right
	return players
}

// Left return left playes
func (s singlesGame) Left() []*Player {
	players := make([]*Player, 1)
	players[0] = s.left
	return players
}

// DoublesGame to play
type doublesGame struct {
	game
	right PlayerPair
	left  PlayerPair
}

// Right return right playes
func (g doublesGame) Right() []*Player {
	players := make([]*Player, 2)
	players[0] = g.right.First
	players[1] = g.right.Second
	return players
}

// Left return left playes
func (g doublesGame) Left() []*Player {
	players := make([]*Player, 2)
	players[0] = g.left.First
	players[1] = g.left.Second
	return players
}

// PlayerPair pair of playes playing a doubles game
type PlayerPair struct {
	First  *Player
	Second *Player
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
	return &singlesGame{
		game: game{
			gameID: id,
			table:  table,
		},
		right: right,
		left:  left,
	}
}
