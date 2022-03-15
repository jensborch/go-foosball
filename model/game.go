package model

import (
	"encoding/json"
	"errors"
	"math"
	"reflect"
	"time"

	uuid "github.com/satori/go.uuid"
)

// Game played
type Game struct {
	Base
	UUID              string          `gorm:"size:36;unique_index"`
	TournamentTableID uint            `json:"-" gorm:"not null"`
	TournamentTable   TournamentTable `gorm:"not null"`
	RightPlayerOneID  uint            `json:"-" gorm:"not null"`
	RightPlayerOne    TournamentPlayer
	RightPlayerTwoID  uint `json:"-"`
	RightPlayerTwo    TournamentPlayer
	LeftPlayerOneID   uint `json:"-" gorm:"not null"`
	LeftPlayerOne     TournamentPlayer
	LeftPlayerTwoID   uint `json:"-"`
	LeftPlayerTwo     TournamentPlayer
	RightScore        int
	LeftScore         int
	Winner            Winner
}

type GameJson struct {
	CreatedAt    time.Time `json:"created"`
	UpdatedAt    time.Time `json:"updated"`
	UUID         string    `json:"uuid"`
	Table        Table     `json:"table"`
	RightPlayers []string  `json:"rightPlayers"`
	LeftPlayers  []string  `json:"leftPlayers"`
	RightScore   int       `json:"rightScore"`
	LeftScore    int       `json:"leftScore"`
	Winner       Winner    `json:"winner,omitempty"`
}

// MarshalJSON creates JSON game representation
func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&GameJson{
		CreatedAt:    g.CreatedAt,
		UpdatedAt:    g.UpdatedAt,
		UUID:         g.UUID,
		Table:        g.TournamentTable.Table,
		RightPlayers: g.RightPlayerNames(),
		LeftPlayers:  g.LeftPlayerNames(),
		RightScore:   g.GetOrCalculateRightScore(),
		LeftScore:    g.GetOrCalculateLeftScore(),
		Winner:       g.Winner,
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

// GetOrCalculateRightScore returns game score for saven games or calcukates new score
func (g *Game) GetOrCalculateRightScore() int {
	if g.RightScore == 0 {
		right, _ := g.GameScore()
		return int(right)
	}
	return g.RightScore
}

// GetOrCalculateLeftScore returns game score for saven games or calculates new score
func (g *Game) GetOrCalculateLeftScore() int {
	if g.LeftScore == 0 {
		_, left := g.GameScore()
		return int(left)
	}
	return g.LeftScore
}

func (g *Game) calculateRightRaning() float64 {
	r := float64(g.RightPlayerOne.Ranking+g.RightPlayerTwo.Ranking) / float64(len(g.Right()))
	return r
}

func (g *Game) calculateLeftRanking() float64 {
	r := float64(g.LeftPlayerOne.Ranking+g.LeftPlayerTwo.Ranking) / float64(len(g.Left()))
	return r
}

func (g *Game) gameLeftScoreFactor() float64 {
	return 1 / (math.Pow(10, ((g.calculateLeftRanking()-g.calculateRightRaning())/1000)) + 1)
}

func round(f float64) uint {
	return uint(f + math.Copysign(0.5, f))
}

// GameScore calculates score for right and left side
func (g *Game) GameScore() (uint, uint) {
	left := round(float64(g.TournamentTable.Tournament.GameScore) * g.gameLeftScoreFactor())
	return g.TournamentTable.Tournament.GameScore - left, left
}

// UpdateScore set game score for each side on game
func (g *Game) UpdateScore() error {
	switch g.Winner {
	case RIGHT:
		right, _ := g.GameScore()
		g.RightScore = int(right)
		g.LeftScore = -int(right)
		return nil
	case LEFT:
		_, left := g.GameScore()
		g.RightScore = -int(left)
		g.LeftScore = int(left)
		return nil
	default:
		return errors.New("no winner in this game")
	}
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

//AddTournamentPlayer adds a tournament player to a game
func (g *Game) AddTournamentPlayer(p *TournamentPlayer) error {
	switch {
	case isEmptyPlayer(g.RightPlayerOne):
		g.RightPlayerOne = *p
	case isEmptyPlayer(g.LeftPlayerOne):
		g.LeftPlayerOne = *p
	case isEmptyPlayer(g.RightPlayerTwo):
		g.RightPlayerTwo = *p
	case isEmptyPlayer(g.LeftPlayerTwo):
		g.LeftPlayerTwo = *p
	default:
		return errors.New("all players have been added")
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
func NewGame(table *TournamentTable) *Game {
	id := uuid.Must(uuid.NewV4(), nil).String()
	return &Game{
		UUID:            id,
		TournamentTable: *table,
	}
}
