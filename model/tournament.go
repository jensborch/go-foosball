package model

import (
	"fmt"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Tournament played
type Tournament struct {
	Base
	Name           string `json:"name" binding:"required" gorm:"type:varchar(100);not null"`
	GameScore      uint   `json:"score" binding:"required" gorm:"not null"`
	InitialRanking uint   `json:"initial" binding:"required" gorm:"not null"`
} //@name Tournament
type TournamentTable struct {
	Base
	TableID      uint       `json:"-" gorm:"not null"`
	Table        Table      `json:"table" binding:"required"`
	TournamentId uint       `json:"-" gorm:"not null"`
	Tournament   Tournament `json:"-"`
} //@name TournamentTable

// TournamentPlayer is a player in a tournament
type TournamentPlayer struct {
	Base
	PlayerID     uint       `json:"-" gorm:"index:player_tournament,unique;not null"`
	Player       Player     `json:"player" binding:"required"`
	TournamentID uint       `json:"-" gorm:"index:player_tournament,unique;not null"`
	Tournament   Tournament `json:"-"`
	Ranking      uint       `json:"ranking" binding:"required"`
	Active       bool       `json:"active" binding:"required"`
	Latest       *time.Time `json:"latest"`
} //@name TournamentPlayer

type TournamentPlayerHistory struct {
	UpdatedAt          time.Time        `json:"updated" binding:"required" gorm:"not null"`
	DeletedAt          gorm.DeletedAt   `json:"-" gorm:"index"`
	TournamentPlayerID uint             `json:"-" gorm:"index:tournament_player:not null"`
	TournamentPlayer   TournamentPlayer `json:"-"`
	Ranking            uint             `json:"ranking" binding:"required" gorm:"not null"`
} //@name TournamentPlayerHistory

// TournamentRepository provides access games etc.
type TournamentRepository interface {
	Store(tournament *Tournament)
	Remove(id string) Found
	Update(tournament *Tournament)
	Find(id string) (*Tournament, Found)
	FindAll() []*Tournament
	RemoveTable(tournamentId string, tableId string) Found
	AddTables(tournamentId string, table *Table) (*TournamentTable, Found)
	FindAllTables(id string) ([]*TournamentTable, Found)
	FindTable(tournamentId string, tableId string) (*TournamentTable, Found)
	AddPlayer(tournamentId string, p *Player) (*TournamentPlayer, Found)
	AddPlayerWithRanking(id string, p *Player, ranking uint) (*TournamentPlayer, Found)
	FindAllActivePlayers(tournamentId string) ([]*TournamentPlayer, Found)
	FindPlayer(tournamentId string, nickname string) (*TournamentPlayer, Found)
	DeactivatePlayer(tournamentId string, nickname string) (*TournamentPlayer, Found)
	ActivatePlayer(tournamentId string, nickname string) (*TournamentPlayer, Found)
	RandomGames(id string) ([]*Game, Found)
	UpdatePlayerRanking(tournamentId string, nickname string, gameScore int) (*TournamentPlayer, Found)
	PlayerHistory(tournamentId string, nickname string, from time.Time) ([]*TournamentPlayerHistory, Found)
	History(tournamentId string, from time.Time) ([]*TournamentPlayerHistory, Found)
}

// NewTournament creates a new tournament
func NewTournament(name string) *Tournament {
	result := &Tournament{
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

// NewTournamentPlayer creates new player in tournament
func NewTournamentPlayer(player *Player, tournament *Tournament) *TournamentPlayer {
	return &TournamentPlayer{
		Tournament: *tournament,
		Player:     *player,
		Ranking:    tournament.InitialRanking,
		Active:     true,
	}
}

func NewTournamentPlayerHistory(player *TournamentPlayer) *TournamentPlayerHistory {
	return &TournamentPlayerHistory{
		TournamentPlayer:   *player,
		TournamentPlayerID: player.PlayerID,
		Ranking:            player.Ranking,
		UpdatedAt:          player.UpdatedAt,
	}
}

func (player *TournamentPlayer) AfterSave(tx *gorm.DB) (err error) {
	if err := tx.Omit(clause.Associations).Create(NewTournamentPlayerHistory(player)).Error; err != nil {
		return fmt.Errorf("unable to update player history: %s", err)
	}
	return nil
}
