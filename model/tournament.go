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
	GameScore         uint               `json:"points" binding:"required"`
	InitialRanking    uint               `json:"initial" binding:"required"`
	TournamentTables  []TournamentTable  `json:"-"`
	TournamentPlayers []TournamentPlayer `json:"-"`
}

// TournamentTable in a foosball game
type TournamentTable struct {
	gorm.Model   `json:"-"`
	TournamentID uint       `json:"-"`
	TableID      uint       `json:"-"`
	Table        Table      `json:"table"`
	Tournament   Tournament `gorm:"association_save_reference:false;association_autocreate:false" json:"-"`
	Games        []Game     `json:"games,omitempty"`
}

// AddTables adds tables to a tournament
func (t *Tournament) AddTables(tables ...Table) {
	var tournamentTables []TournamentTable
	for _, table := range tables {
		tt := TournamentTable{
			TableID:      table.ID,
			Table:        table,
			TournamentID: t.ID,
			Tournament:   *t,
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
			Player:  *p,
			Ranking: t.InitialRanking,
			Active:  true,
		}
		p.TournamentPlayers = append(p.TournamentPlayers, newPlayer)
		t.TournamentPlayers = append(t.TournamentPlayers, newPlayer)
	}
}

// DeactivatePlayer deactivates player in tournament
func (t *Tournament) DeactivatePlayer(nickName string) Found {
	for i, tp := range t.TournamentPlayers {
		log.Println(tp)
		if tp.Player.Nickname == nickName {
			t.TournamentPlayers[i].Active = false
			return true
		}
	}
	return false
}

// ActivePlayers list active players
func (t *Tournament) ActivePlayers() []TournamentPlayer {
	result := make([]TournamentPlayer, 0, len(t.TournamentPlayers))
	for _, tp := range t.TournamentPlayers {
		if tp.Active {
			result = append(result, tp)
		}
	}
	return result
}

//ShuffleActivePlayers shuffles the players in a tournament
func (t *Tournament) ShuffleActivePlayers() []TournamentPlayer {
	players := t.ActivePlayers()
	rand.Shuffle(len(players), func(i, j int) {
		players[i], players[j] = players[j], players[i]
	})
	return players
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}

//RandomGames generates a list of random games for tournament
func (t *Tournament) RandomGames() []Game {
	players := t.ShuffleActivePlayers()
	games := make([]Game, 0, 2)
	if len(players) >= 2 {
		i := 0
		for _, table := range t.TournamentTables {
			g := NewGame(table)
			playersInGameIndex := min(i+4, len(players))
			if playersInGameIndex-i > 1 {
				for ; i < playersInGameIndex; i++ {
					g.AddTournamentPlayer(players[i])
				}
				games = append(games, *g)
			}
		}
	}
	return games
}

// Table returns true if table is in tournament
func (t *Tournament) Table(id string) *TournamentTable {
	for _, tt := range t.TournamentTables {
		if tt.Table.UUID == id {
			return &tt
		}
	}
	return nil
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
	id := uuid.Must(uuid.NewV4(), nil).String()
	result := &Tournament{
		UUID:           id,
		Name:           name,
		GameScore:      50,
		InitialRanking: 1500,
	}
	result.AddTables(tables...)
	return result
}
