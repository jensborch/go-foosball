package model

import (
	"time"

	"gorm.io/gorm"
)

// Player playing foosball games
type Player struct {
	ID        uint           `json:"-" binding:"required" gorm:"primary_key"`
	CreatedAt time.Time      `json:"created" binding:"required" gorm:"not null"`
	UpdatedAt time.Time      `json:"updated" binding:"required" gorm:"not null"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	Nickname  string         `json:"nickname" binding:"required" gorm:"size:50;unique_index,not null"`
	RealName  string         `json:"realname" gorm:"type:varchar(100)"`
	RFID      string         `json:"rfid,omitempty" gorm:"type:varchar(36)"`
} //@name Player

// PlayerRepository provides access to players
type PlayerRepository interface {
	Store(player *Player)
	Remove(nickname string) Found
	Update(player *Player)
	Find(nickname string) (*Player, Found)
	FindAll() []*Player
	FindAllNotInTournament(id string) []*Player
	FindByTournament(id string) []*Player
}

// NewPlayer creates new player
func NewPlayer(nickname, realName string, rfid string) *Player {
	return &Player{
		Nickname: nickname,
		RealName: realName,
		RFID:     rfid,
	}
}

// NewTournamentPlayer creates new player in tournament
func NewTournamentPlayerWithRanking(player *Player, tournament *Tournament, ranking uint) *TournamentPlayer {
	return &TournamentPlayer{
		Tournament: *tournament,
		Player:     *player,
		Ranking:    ranking,
		Active:     true,
	}
}
