package model

import (
	"time"

	"gorm.io/gorm"
)

// Player playing foosball games
type Player struct {
	ID        uint           `json:"-" gorm:"primary_key"`
	CreatedAt time.Time      `json:"created"`
	UpdatedAt time.Time      `json:"updated"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	Nickname  string         `json:"nickname" binding:"required" gorm:"size:50;unique_index"`
	RealName  string         `json:"realname" gorm:"type:varchar(100)"`
	RFID      string         `json:"rfid,omitempty" gorm:"type:varchar(36)"`
} //@name Player

// TournamentPlayer is a player in a tournament
type TournamentPlayer struct {
	Base
	PlayerID     uint       `json:"-" gorm:"index:player_tournament,unique"`
	Player       Player     `json:"player"`
	TournamentID uint       `json:"-" gorm:"index:player_tournament,unique"`
	Tournament   Tournament `json:"-"`
	Ranking      uint       `json:"ranking"`
	Active       bool       `json:"active"`
} //@name TournamentPlayer

// PlayerRepository provides access players
type PlayerRepository interface {
	Store(player *Player)
	Remove(nickname string) Found
	Update(player *Player)
	Find(nickname string) (*Player, Found)
	FindAll() []*Player
	FindByTournament(id string) []*Player
}

// NewPlayer create new player
func NewPlayer(nickname, realName string, rfid string) *Player {
	return &Player{
		Nickname: nickname,
		RealName: realName,
		RFID:     rfid,
	}
}

// NewTournamentPlayer create new player in tournament
func NewTournamentPlayer(player *Player, tournament *Tournament) *TournamentPlayer {
	return &TournamentPlayer{
		Tournament: *tournament,
		Player:     *player,
		Ranking:    tournament.InitialRanking,
		Active:     true,
	}
}

// NewTournamentPlayer create new player in tournament
func NewTournamentPlayerWithRanking(player *Player, tournament *Tournament, ranking uint) *TournamentPlayer {
	return &TournamentPlayer{
		Tournament: *tournament,
		Player:     *player,
		Ranking:    ranking,
		Active:     true,
	}
}
