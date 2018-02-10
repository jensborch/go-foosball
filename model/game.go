package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Game played
type Game interface {
	UUID() string
	Right() []*Player
	Left() []*Player
	TournamentTable() *TournamentTable
}

// AbstractGame for shared game functionality
type game struct {
	gorm.Model
	uuid              string `gorm:"size:36;unique_index"`
	tournamentTableID uint
	tournamentTable   *TournamentTable `gorm:"ForeignKey:tournamentTableID;AssociationForeignKey:ID"`
}

func (g game) TournamentTable() *TournamentTable {
	return g.tournamentTable
}

func (g game) UUID() string {
	return g.uuid
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

// GameRepository provides access games etc.
type GameRepository interface {
	Store(game *Game) error
	Find(id uuid.UUID) (*Game, error)
	FindAll() []*Game
}

// NewSinglesGame creates a new game
func NewSinglesGame(table *TournamentTable, right *Player, left *Player) Game {
	id := uuid.Must(uuid.NewV4()).String()
	return &singlesGame{
		game: game{
			uuid:            id,
			tournamentTable: table,
		},
		right: right,
		left:  left,
	}
}

func MigrateGameDB(db *gorm.DB) {
	db.AutoMigrate(&game{})
}
