package model

import (
	"github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	TournamentID uuid.UUID
	Name         string
	Tables       []*TournamentTable
}

// TournamentTable in a foosball game
type TournamentTable struct {
	TableID    uuid.UUID
	Table      *Table
	Tournament *Tournament
	Games      []*Game
}

// TournamentRepository provides access games etc.
type TournamentRepository interface {
	Store(tournament *Tournament) error
	Find(id uuid.UUID) (*Tournament, error)
	FindAll() []*Tournament
}

// NewTournament creates a new tournament
func NewTournament(name string, tables []*Table) *Tournament {
	id := uuid.Must(uuid.NewV4())
	tournamentTables := []*TournamentTable{}
	for _, t := range tables {
		tid := uuid.Must(uuid.NewV4())
		tt := TournamentTable{
			TableID: tid,
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
