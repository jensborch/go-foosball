package model

// Tournament played
type Tournament struct {
	Base
	Name           string `json:"name" binding:"required" gorm:"type:varchar(100)"`
	GameScore      uint   `json:"score" binding:"required"`
	InitialRanking uint   `json:"initial" binding:"required"`
} //@name Tournament
type TournamentTable struct {
	Base
	TableID      uint       `json:"-"`
	Table        Table      `json:"table"`
	TournamentId uint       `json:"-"`
	Tournament   Tournament `json:"-"`
} //@name TournamentTable

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
