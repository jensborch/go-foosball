package model

import (
	uuid "github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	Base
	UUID           string `json:"uuid" gorm:"size:36;unique_index"`
	Name           string `json:"name" binding:"required" gorm:"type:varchar(100)"`
	GameScore      uint   `json:"score" binding:"required"`
	InitialRanking uint   `json:"initial" binding:"required"`
}
type TournamentTable struct {
	Base
	TableID      uint       `json:"-"`
	Table        Table      `json:"table"`
	TournamentID uint       `json:"-"`
	Tournament   Tournament `json:"tournament"`
}

// TournamentRepository provides access games etc.
type TournamentRepository interface {
	Store(tournament *Tournament) error
	Remove(tournament *Tournament) error
	Update(tournament *Tournament) error
	Find(uuid string) (*Tournament, Found, error)
	FindAll() []*Tournament
	RemoveTable(tournamentUuid string, tableUuid string) (Found, error)
	AddTables(tournamentUuid string, tables ...*Table) (Found, error)
	FindAllTables(uuid string) ([]*TournamentTable, Found, error)
	FindTable(tournamentUuid string, tableUuid string) (*TournamentTable, Found, error)
	AddPlayer(tournamentUuid string, p *Player) (Found, error)
	AddPlayerWithRanking(uuid string, p *Player, ranking uint) (Found, error)
	FindAllActivePlayers(tournamentUuid string) ([]*TournamentPlayer, Found, error)
	FindPlayer(tournamentUuid string, nickname string) (*TournamentPlayer, Found, error)
	DeactivatePlayer(tournamentUuid string, nickname string) (Found, error)
	ActivatePlayer(tournamentUuid string, nickname string) (Found, error)
	RandomGames(uuid string) ([]*Game, Found, error)
}

// NewTournament creates a new tournament
func NewTournament(name string) *Tournament {
	id := uuid.Must(uuid.NewV4(), nil).String()
	result := &Tournament{
		UUID:           id,
		Name:           name,
		GameScore:      50,
		InitialRanking: 1500,
	}
	return result
}

// NewTournament creates a new tournament
func NewTournamentTable(tournament *Tournament, table *Table) *TournamentTable {
	return &TournamentTable{
		Tournament: *tournament,
		Table:      *table,
	}
}
