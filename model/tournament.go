package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	gorm.Model       `json:"-"`
	UUID             string             `json:"uuid" gorm:"size:36;unique_index"`
	Name             string             `json:"name" binding:"required" gorm:"type:varchar(100)"`
	TournamentTables []*TournamentTable `json:"-"`
	Players          []*Player          `json:"-"`
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

// AddTables adds tables to a tournament
func (t *Tournament) AddTables(tables ...*Table) {
	tournamentTables := []*TournamentTable{}
	for _, table := range tables {
		tt := TournamentTable{
			TableID:      table.ID,
			Table:        table,
			TournamentID: t.ID,
		}
		tournamentTables = append(tournamentTables, &tt)
	}
	t.TournamentTables = append(t.TournamentTables, tournamentTables...)
}

// TournamentRepository provides access games etc.
type TournamentRepository interface {
	Store(tournament *Tournament) error
	Remove(tournament *Tournament) error
	Find(uuid string) (*Tournament, Found, error)
	FindAll() []*Tournament
}

// NewTournament creates a new tournament
func NewTournament(name string, tables ...*Table) *Tournament {
	id := uuid.Must(uuid.NewV4()).String()
	result := &Tournament{
		UUID: id,
		Name: name,
	}
	result.AddTables(tables...)
	return result
}
