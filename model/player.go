package model

// Player playing foosball games
type Player struct {
	Base
	Nickname string `json:"nickname" binding:"required" gorm:"size:50;unique_index"`
	RealName string `json:"realname" gorm:"type:varchar(100);not null"`
	RFID     string `json:"rfid,omitempty" gorm:"type:varchar(36)"`
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
