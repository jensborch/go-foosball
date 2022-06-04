package model

// Tournament played
type Tournament struct {
	Base
	Name           string `json:"name" validate:"required" gorm:"type:varchar(100);not null"`
	GameScore      uint   `json:"score" validate:"required" gorm:"not null"`
	InitialRanking uint   `json:"initial" validate:"required" gorm:"not null"`
} //@name Tournament
type TournamentTable struct {
	Base
	TableID      uint       `json:"-" gorm:"not null"`
	Table        Table      `json:"table" validate:"required"`
	TournamentId uint       `json:"-" gorm:"not null"`
	Tournament   Tournament `json:"-"`
} //@name TournamentTable

// TournamentPlayer is a player in a tournament
type TournamentPlayer struct {
	Base
	PlayerID     uint       `json:"-" gorm:"index:player_tournament,unique;not null"`
	Player       Player     `json:"player" validate:"required"`
	TournamentID uint       `json:"-" gorm:"index:player_tournament,unique;not null"`
	Tournament   Tournament `json:"-"`
	Ranking      uint       `json:"ranking" validate:"required"`
	Active       bool       `json:"active" validate:"required"`
} //@name TournamentPlayer

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
	DeactivatePlayer(tournamentId string, nickname string) Found
	ActivatePlayer(tournamentId string, nickname string) Found
	RandomGames(id string) ([]*Game, Found)
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
