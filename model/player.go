package model

// Player playing foosball games
type Player struct {
	Base
	Nickname          string             `json:"nickname" binding:"required" gorm:"size:50;unique_index"`
	RealName          string             `json:"realname" gorm:"type:varchar(100);not null"`
	RFID              string             `json:"rfid,omitempty" gorm:"type:varchar(36)"`
	TournamentPlayers []TournamentPlayer `json:"tournaments,omitempty"`
}

// TournamentPlayer is a player in a tournament
type TournamentPlayer struct {
	Base
	PlayerID     uint       `json:"-"`
	Player       Player     `json:"-"`
	TournamentID uint       `json:"-"`
	Tournament   Tournament `json:"tournament"`
	Ranking      uint       `json:"ranking"`
	Active       bool       `json:"active"`
}

// IsActive returns true if player is active in tournament
func (p *Player) IsActive(tournamentID string) bool {
	for _, t := range p.TournamentPlayers {
		if t.Tournament.UUID == tournamentID {
			return true
		}
	}
	return false
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
func NewPlayer(nickname, realName string) *Player {
	return &Player{
		Nickname:          nickname,
		RealName:          realName,
		TournamentPlayers: make([]TournamentPlayer, 0, 10),
	}
}

// NewTournamentPlayer create new player in tournament
func NewTournamentPlayer(player Player, tournament Tournament) *TournamentPlayer {
	tp := &TournamentPlayer{
		Player:     player,
		Tournament: tournament,
		Ranking:    tournament.InitialRanking,
		Active:     true,
	}
	tp.Player.TournamentPlayers = append(tp.Player.TournamentPlayers, *tp)
	return tp
}
