package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Playable game
type Playable interface {
	UUID() string
	Right() []*Player
	Left() []*Player
	TournamentTable() *TournamentTable
}

// Game played
type Game struct {
	gorm.Model
	uuid              string `gorm:"size:36;unique_index"`
	tournamentTableID uint
	tournamentTable   *TournamentTable `gorm:"ForeignKey:tournamentTableID;AssociationForeignKey:ID"`
	rigthPlayer1ID    uint
	rigthPlayer2ID    uint
	leftPlayer1ID     uint
	leftPlayer2ID     uint
	rigthPlayer1      *Player `gorm:"ForeignKey:rightPlayer1ID;AssociationForeignKey:ID"`
	rigthPlayer2      *Player `gorm:"ForeignKey:rightPlayer2ID;AssociationForeignKey:ID"`
	leftPlayer1       *Player `gorm:"ForeignKey:leftPlayer1ID;AssociationForeignKey:ID"`
	leftPlayer2       *Player `gorm:"ForeignKey:leftPlayer2ID;AssociationForeignKey:ID"`
}

// TournamentTable for game
func (g Game) TournamentTable() *TournamentTable {
	return g.tournamentTable
}

// UUID for a game
func (g Game) UUID() string {
	return g.uuid
}

// Right return right playes
func (g Game) Right() []*Player {
	var players []*Player
	if g.rigthPlayer2 == nil {
		players = make([]*Player, 1)
		players[0] = g.rigthPlayer1
	} else {
		players = make([]*Player, 2)
		players[0] = g.rigthPlayer1
		players[1] = g.rigthPlayer2
	}
	return players
}

// Left return left playes
func (g Game) Left() []*Player {
	var players []*Player
	if g.leftPlayer2 == nil {
		players = make([]*Player, 1)
		players[0] = g.leftPlayer1
	} else {
		players = make([]*Player, 2)
		players[0] = g.leftPlayer1
		players[1] = g.leftPlayer2
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
		uuid:            id,
		tournamentTable: table,
		rigthPlayer1:    right.First,
		leftPlayer1:     left.First,
		rigthPlayer2:    right.Second,
		leftPlayer2:     left.Second,
	}
}

// NewSinglesGame creates a new game
func NewSinglesGame(table *TournamentTable, right *Player, left *Player) *Game {
	id := uuid.Must(uuid.NewV4()).String()
	return &Game{
		uuid:            id,
		tournamentTable: table,
		rigthPlayer1:    right,
		leftPlayer1:     left,
	}
}
