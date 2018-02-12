package model

import (
	"github.com/jinzhu/gorm"
)

// Player playing foosball games
type Player struct {
	gorm.Model
	Nickname string `"json:"name" gorm:"size:50;unique_index"`
	RealName string `gorm:"size:100"`
}

// PlayerRepository provides access players
type PlayerRepository interface {
	Store(player *Player) error
	Remove(player *Player) error
	Find(nickname string) (*Player, error)
	FindAll() []*Player
}

// NewPlayer create new palyer
func NewPlayer(nickname, realName string) *Player {
	return &Player{
		Nickname: nickname,
		RealName: realName,
	}
}
