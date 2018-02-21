package model

import (
	"github.com/jinzhu/gorm"
)

// Player playing foosball games
type Player struct {
	gorm.Model        `json:"-"`
	Nickname          string             `json:"nickname" binding:"required" gorm:"size:50;unique_index"`
	RealName          string             `json:"realname" gorm:"type:varchar(100);not null"`
	RFID              string             `json:"rfid, omitempty" gorm:"type:varchar(36)"`
	TournamentPlayers []TournamentPlayer `json:"tournaments, omitempty"`
}

// TournamentPlayer is a player in a tournament
type TournamentPlayer struct {
	gorm.Model   `json:"-"`
	PlayerID     uint       `json:"-"`
	Player       Player     `json:"-"`
	TournamentID uint       `json:"-"`
	Tournament   Tournament `json:"tournament" gorm:"save_associations:false"`
	Points       uint       `json:"points"`
	Active       bool       `json:"active"`
}

// AddToTournament adds a player to a tournament
func (p *Player) AddToTournament(t Tournament) {
	var found = false
	for _, tp := range p.TournamentPlayers {
		if tp.Tournament.UUID == t.UUID {
			tp.Active = true
			found = true
			break
		}
	}
	if !found {
		newPlayer := TournamentPlayer{
			Tournament: t,
			Player:     *p,
			Points:     t.InitialPoints,
			Active:     true,
		}
		p.TournamentPlayers = append(p.TournamentPlayers, newPlayer)
		t.TournamentPlayers = append(t.TournamentPlayers, newPlayer)
	}
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
		Nickname:          nickname,
		RealName:          realName,
		TournamentPlayers: make([]TournamentPlayer, 0, 10),
	}
}
