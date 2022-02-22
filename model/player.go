package model

import "fmt"

// Player playing foosball games
type Player struct {
	Base
	Nickname          string             `json:"nickname" binding:"required" gorm:"size:50;unique_index"`
	RealName          string             `json:"realname" gorm:"type:varchar(100);not null"`
	RFID              string             `json:"rfid,omitempty" gorm:"type:varchar(36)"`
	TournamentPlayers []TournamentPlayer `json:"-"`
}

// TournamentPlayer is a player in a tournament
type TournamentPlayer struct {
	Base
	PlayerID     uint       `json:"-"`
	Player       Player     `json:"player"`
	TournamentID uint       `json:"tournament"`
	Tournament   Tournament `json:"-"`
	Ranking      uint       `json:"ranking"`
	Active       bool       `json:"active"`
}

// IsActive returns true if player is active in tournament
func (p *Player) IsActive(tournamentID string) bool {
	for _, t := range p.TournamentPlayers {
		if t.Tournament.UUID == tournamentID {
			return t.Active
		}
	}
	return false
}

// GetRanking returns ranking or 0 in a given tournament.
func (p *Player) GetRanking(tournamentID string) uint {
	if p, err := p.GetTournamentPlayer(tournamentID); err == nil {
		return p.Ranking
	} else {
		return 0
	}
}

// GetTournamentPlayer returns TournamentPlayer for tournament
func (p *Player) GetTournamentPlayer(tournamentID string) (*TournamentPlayer, error) {
	for _, t := range p.TournamentPlayers {
		if t.Tournament.UUID == tournamentID {
			return &t, nil
		}
	}
	return nil, fmt.Errorf("Player %s is not in tournament %s", p.Nickname, tournamentID)
}

// PlayerRepository provides access players
type PlayerRepository interface {
	Store(player *Player) error
	Remove(nickname string) (Found, error)
	Update(player *Player) error
	Find(nickname string) (*Player, Found, error)
	FindAll() []*Player
	FindByTournament(id string) []*Player
}

// NewPlayer create new player
func NewPlayer(nickname, realName string, rfid string) *Player {
	return &Player{
		Nickname:          nickname,
		RealName:          realName,
		RFID:              rfid,
		TournamentPlayers: make([]TournamentPlayer, 0, 10),
	}
}

// NewTournamentPlayer create new player in tournament
func NewTournamentPlayer(player *Player, tournament Tournament) *TournamentPlayer {
	tp := &TournamentPlayer{
		Tournament: tournament,
		Ranking:    tournament.InitialRanking,
		Active:     true,
	}
	player.TournamentPlayers = append(player.TournamentPlayers, *tp)
	tp.Player = *player
	return tp
}
