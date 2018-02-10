package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Player playing foosball games
type Player struct {
	gorm.Model
	UUID     string `gorm:"size:36;unique_index"`
	Nickname string `gorm:"size:50;unique_index"`
	RealName string `gorm:"size:100"`
}

// NewPlayer create new palyer
func NewPlayer(nickname, realName string) *Player {
	id := uuid.Must(uuid.NewV4()).String()
	return &Player{
		UUID:     id,
		Nickname: nickname,
		RealName: realName,
	}
}
