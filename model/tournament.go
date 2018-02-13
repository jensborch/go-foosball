package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	gorm.Model       `json:"-"`
	UUID             string             `json:"uuid" gorm:"size:36;unique_index"`
	Name             string             `json:"name" gorm:"type:varchar(100)"`
	TournamentTables []*TournamentTable `json:"-" gorm:"ForeignKey:ID;AssociationForeignKey:TournamentID"`
	Players          []*Player          `json:"-" gorm:"ForeignKey:ID;AssociationForeignKey:TournamentID"`
}

// TournamentTable in a foosball game
type TournamentTable struct {
	gorm.Model
	TournamentID uint
	TableID      uint
	Table        *Table      `gorm:"ForeignKey:TableID;AssociationForeignKey:ID"`
	Tournament   *Tournament `gorm:"ForeignKey:TournamentID;AssociationForeignKey:ID"`
	Games        []*Game     `gorm:"ForeignKey:ID;AssociationForeignKey:tournamentTableID"`
}

// AddTables adds tables to a tournament
func (t *Tournament) AddTables(tables ...*Table) {
	tournamentTables := []*TournamentTable{}
	for _, t := range tables {
		tt := TournamentTable{
			TableID: t.ID,
			Table:   t,
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
