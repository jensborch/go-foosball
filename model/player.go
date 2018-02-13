package model

import (
	"github.com/jinzhu/gorm"
)

// Player playing foosball games
type Player struct {
	gorm.Model   `json:"-"`
	Nickname     string      `json:"nickname" gorm:"size:50;unique_index"`
	RealName     string      `json:"realname" gorm:"type:varchar(100);not null"`
	RFID         string      `json:"rfid, omitempty" gorm:"type:varchar(36)"`
	TournamentID uint        `json:"-"`
	Tournament   *Tournament `json:"tournament, omitempty"`
}

// PlayerRepository provides access players
type PlayerRepository interface {
	Store(player *Player) error
	Remove(player *Player) error
	Update(player *Player) error
	Find(nickname string) (*Player, Found, error)
	FindAll() []*Player
}

// NewPlayer create new palyer
func NewPlayer(nickname, realName string) *Player {
	return &Player{
		Nickname: nickname,
		RealName: realName,
	}
}
