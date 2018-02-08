package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	gorm.Model
	TournamentID string
	Name         string
	Tables       []*TournamentTable
}

// TournamentTable in a foosball game
type TournamentTable struct {
	gorm.Model
	TournamentID uint
	TableID      uint
	Table        *Table
	Tournament   *Tournament
	Games        []*Game
}

// TournamentRepository provides access games etc.
type TournamentRepository interface {
	Store(tournament *Tournament) error
	Find(id uuid.UUID) (*Tournament, error)
	FindAll() []*Tournament
}

// NewTournament creates a new tournament
func NewTournament(name string, tables []*Table) *Tournament {
	id := uuid.Must(uuid.NewV4()).String()
	tournamentTables := []*TournamentTable{}
	for _, t := range tables {
		tt := TournamentTable{
			TableID: t.ID,
			Table:   t,
		}
		tournamentTables = append(tournamentTables, &tt)
	}
	return &Tournament{
		TournamentID: id,
		Name:         name,
		Tables:       tournamentTables,
	}
}
