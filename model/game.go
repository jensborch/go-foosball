package model

import (
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"reflect"

	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Game played
type Game struct {
	gorm.Model        `json:"-"`
	UUID              string           `gorm:"size:36;unique_index"`
	TournamentTableID uint             `json:"-"`
	TournamentTable   TournamentTable  `json:"table"`
	RightPlayerOneID  uint             `json:"-"`
	RightPlayerTwoID  uint             `json:"-"`
	LeftPlayerOneID   uint             `json:"-"`
	LeftPlayerTwoID   uint             `json:"-"`
	RightPlayerOne    TournamentPlayer `json:"-"`
	RightPlayerTwo    TournamentPlayer `json:"-"`
	LeftPlayerOne     TournamentPlayer `json:"-"`
	LeftPlayerTwo     TournamentPlayer `json:"-"`
	RightPoints       int
	LeftPoints        int
	Winner            Winner `json:"winner"`
}

// MarshalJSON creates JSON game representation
func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		UUID   string   `json:"uuid"`
		Table  Table    `json:"table"`
		Right  []string `json:"right"`
		Left   []string `json:"left"`
		Winner Winner   `json:"winner,omitempty"`
	}{
		UUID:   g.UUID,
		Table:  g.TournamentTable.Table,
		Right:  g.RightPlayerNames(),
		Left:   g.LeftPlayerNames(),
		Winner: g.Winner,
	})
}

// Winner of a game played
type Winner string

const (
	//RIGHT is winner
	RIGHT Winner = "right"

	//LEFT is winner
	LEFT = "left"
)

//
func (g *Game) calculateRightScore() float64 {
	r := float64(g.RightPlayerOne.Ranking+g.RightPlayerTwo.Ranking) / float64(len(g.Right()))
	return r
}

//
func (g *Game) calculateLeftScore() float64 {
	r := float64(g.LeftPlayerOne.Ranking+g.LeftPlayerTwo.Ranking) / float64(len(g.Left()))
	return r
}

//
func (g *Game) gameScoreFactor() (float64, float64) {
	rigth := 1 / (math.Pow(10, ((g.calculateLeftScore()-g.calculateRightScore())/1000)) + 1)
	return rigth, 1 - rigth
}

//
func (g *Game) GameScore() (uint, uint) {
	right, left := g.gameScoreFactor()
	return uint(float64(g.TournamentTable.Tournament.GameScore) * right), uint(float64(g.TournamentTable.Tournament.GameScore) * left)
}

// Right return right playes
func (g Game) Right() []Player {
	var players []Player
	if isEmptyPlayer(g.RightPlayerTwo) {
		players = make([]Player, 1)
		players[0] = g.RightPlayerOne.Player
	} else {
		players = make([]Player, 2)
		players[0] = g.RightPlayerOne.Player
		players[1] = g.RightPlayerTwo.Player
	}
	return players
}

// RightPlayerNames return right player names
func (g Game) RightPlayerNames() []string {
	result := make([]string, 0, 2)
	for _, n := range g.Right() {
		result = append(result, n.Nickname)
	}
	return result
}

// Left return left playes
func (g Game) Left() []Player {
	var players []Player
	if isEmptyPlayer(g.LeftPlayerTwo) {
		players = make([]Player, 1)
		players[0] = g.LeftPlayerOne.Player
	} else {
		players = make([]Player, 2)
		players[0] = g.LeftPlayerOne.Player
		players[1] = g.LeftPlayerTwo.Player
	}
	return players
}

// LeftPlayerNames return right player names
func (g Game) LeftPlayerNames() []string {
	result := make([]string, 0, 2)
	for _, n := range g.Left() {
		result = append(result, n.Nickname)
	}
	return result
}

func isEmptyPlayer(p TournamentPlayer) bool {
	return reflect.DeepEqual(p, TournamentPlayer{})
}

// AddPlayer adds a player to a game
func (g *Game) AddPlayer(p Player) error {
	if tp, err := g.findOrCreateTournamentPlayer(p); err == nil {
		return g.AddTournamentPlayer(*tp)
	} else {
		return err
	}
}

func (g *Game) findOrCreateTournamentPlayer(p Player) (*TournamentPlayer, error) {
	for _, tp := range g.TournamentTable.Tournament.TournamentPlayers {
		if p.Nickname == tp.Player.Nickname {
			if !tp.Active {
				return nil, fmt.Errorf("Player %s is not active", p.Nickname)
			}
			return &tp, nil
		}
	}
	return NewTournamentPlayer(p, g.TournamentTable.Tournament), nil
}

//AddTournamentPlayer adds a tournament player to a game
func (g *Game) AddTournamentPlayer(p TournamentPlayer) error {
	switch {
	case isEmptyPlayer(g.RightPlayerOne):
		g.RightPlayerOne = p
	case isEmptyPlayer(g.LeftPlayerOne):
		g.LeftPlayerOne = p
	case isEmptyPlayer(g.RightPlayerTwo):
		g.RightPlayerTwo = p
	case isEmptyPlayer(g.LeftPlayerTwo):
		g.LeftPlayerTwo = p
	default:
		return errors.New("All players have been added")
	}
	return nil
}

// GameRepository provides access games etc.
type GameRepository interface {
	Store(game *Game) error
	Find(uuid string) (*Game, Found, error)
	FindAll() []*Game
	FindByTournament(uuid string) []*Game
}

// NewGame creates a new game
func NewGame(table TournamentTable) *Game {
	id := uuid.Must(uuid.NewV4(), nil).String()
	return &Game{
		UUID:            id,
		TournamentTable: table,
	}
}
