package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	gorm.Model
	UUID             string             `gorm:"size:36;unique_index"`
	Name             string             `gorm:"type:varchar(100)"`
	TournamentTables []*TournamentTable `gorm:"ForeignKey:ID;AssociationForeignKey:TournamentID"`
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

// TournamentRepository provides access games etc.
type TournamentRepository interface {
	Store(tournament *Tournament) error
	Find(uuid string) (*Tournament, error)
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
		UUID:             id,
		Name:             name,
		TournamentTables: tournamentTables,
	}
}
