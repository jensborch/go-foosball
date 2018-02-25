package model

import (
	"log"
	"math/rand"

	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Tournament played
type Tournament struct {
	gorm.Model        `json:"-"`
	UUID              string             `json:"uuid" gorm:"size:36;unique_index"`
	Name              string             `json:"name" binding:"required" gorm:"type:varchar(100)"`
	GamePoints        uint               `json:"points" binding:"required"`
	InitialPoints     uint               `json:"initial" binding:"required"`
	TournamentTables  []TournamentTable  `json:"-"`
	TournamentPlayers []TournamentPlayer `json:"-"`
}

// TournamentTable in a foosball game
type TournamentTable struct {
	gorm.Model
	TournamentID uint
	TableID      uint
	Table        Table
	Tournament   Tournament
	Games        []Game
}

// AddTables adds tables to a tournament
func (t *Tournament) AddTables(tables ...Table) {
	var tournamentTables []TournamentTable
	for _, table := range tables {
		tt := TournamentTable{
			TableID:      table.ID,
			Table:        table,
			TournamentID: t.ID,
		}
		tournamentTables = append(tournamentTables, tt)
	}
	t.TournamentTables = append(t.TournamentTables, tournamentTables...)
}

// AddPlayer adds a player to a tournament
func (t *Tournament) AddPlayer(p *Player) {
	var found = false
	for i, tp := range t.TournamentPlayers {
		if tp.Player.Nickname == p.Nickname {
			t.TournamentPlayers[i].Active = true
			found = true
			break
		}
	}
	if !found {
		newPlayer := TournamentPlayer{
			Player: *p,
			Points: t.InitialPoints,
			Active: true,
		}
		p.TournamentPlayers = append(p.TournamentPlayers, newPlayer)
		t.TournamentPlayers = append(t.TournamentPlayers, newPlayer)
	}
}

//ShufflePlayers shuffles the players in a tournament
func (t *Tournament) ShufflePlayers() []TournamentPlayer {
	rand.Shuffle(len(t.TournamentPlayers), func(i, j int) {
		t.TournamentPlayers[i], t.TournamentPlayers[j] = t.TournamentPlayers[j], t.TournamentPlayers[i]
	})
	return t.TournamentPlayers
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}

//RandomGames genrates a list of random games for tournament
func (t *Tournament) RandomGames() []Game {
	players := t.ShufflePlayers()
	games := make([]Game, 0, 2)
	if len(players) >= 2 {
		i := 0
		for _, table := range t.TournamentTables {
			g := NewGame(table)
			playersInGameIndex := min(i+4, len(players))
			if playersInGameIndex-i > 1 {
				for ; i < playersInGameIndex; i++ {
					g.AddPlayer(players[i].Player)
				}
				games = append(games, *g)
			}
		}
	}
	log.Println(games)
	return games
}

// TournamentRepository provides access games etc.
type TournamentRepository interface {
	Store(tournament *Tournament) error
	Remove(tournament *Tournament) error
	Update(tournament *Tournament) error
	Find(uuid string) (*Tournament, Found, error)
	FindAll() []*Tournament
}

// NewTournament creates a new tournament
func NewTournament(name string, tables ...Table) *Tournament {
	id := uuid.Must(uuid.NewV4()).String()
	result := &Tournament{
		UUID: id,
		Name: name,
	}
	result.AddTables(tables...)
	return result
}
