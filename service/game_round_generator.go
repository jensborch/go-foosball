// Package service contains business logic services for the foosball application.
package service

import (
	"log"
	"math/rand/v2"
	"sort"
	"sync"

	"github.com/jensborch/go-foosball/model"
)

var (
	once          sync.Once
	generators    map[string]*GameRoundGenerator
	generatorLock sync.Mutex
)

// GameRoundGenerator manages round-robin game scheduling for tournaments.
// It generates all possible player combinations and cycles through them.
type GameRoundGenerator struct {
	sync.Mutex
	current int
	rounds  [][]*model.Game
	players []*model.TournamentPlayer
	tables  []*model.TournamentTable
}

// GetGameRoundGenerator returns the singleton GameRoundGenerator for a tournament.
// Thread-safe for concurrent access.
func GetGameRoundGenerator(tournamentId string) *GameRoundGenerator {
	log.Printf("Getting game round generator for tournament %s", tournamentId)
	generatorLock.Lock()
	defer generatorLock.Unlock()

	once.Do(func() {
		generators = make(map[string]*GameRoundGenerator)
	})

	g, ok := generators[tournamentId]
	if !ok {
		log.Printf("Creating new generator for tournament %s", tournamentId)
		g = &GameRoundGenerator{}
		generators[tournamentId] = g
	}
	return g
}

// ClearGameRoundGenerator removes the GameRoundGenerator instance for a tournament.
// Useful for cleanup or when tournament configuration changes significantly.
func ClearGameRoundGenerator(tournamentId string) {
	generatorLock.Lock()
	defer generatorLock.Unlock()
	delete(generators, tournamentId)
}

// NextRound returns the next round of games in the rotation.
// Cycles back to the first round after the last one.
func (g *GameRoundGenerator) NextRound() []*model.Game {
	g.Lock()
	defer g.Unlock()
	var result []*model.Game = nil
	if len(g.rounds) != 0 {
		if g.current >= len(g.rounds) {
			g.current = 0
		}
		result = g.rounds[g.current]
		g.current++
	}
	log.Printf("Playing round %d", g.current)
	return result
}

// Randomize shuffles the order of rounds.
func (g *GameRoundGenerator) Randomize() {
	g.Lock()
	defer g.Unlock()
	if g.rounds != nil {
		result := make([][]*model.Game, len(g.rounds))
		perm := rand.Perm(len(g.rounds))
		for i, v := range perm {
			result[i] = g.rounds[v]
		}
		g.rounds = result
	}
}

// GenerateRounds recalculates game rounds if players or tables have changed.
// Returns the number of rounds generated, or 0 if no update was needed.
func (g *GameRoundGenerator) GenerateRounds(players []*model.TournamentPlayer, tables []*model.TournamentTable) int {
	g.Lock()
	defer g.Unlock()
	if !isSamePlayers(g.players, players) || !isSameTables(g.tables, tables) {
		g.players = players
		g.tables = tables
		g.rounds = allGamePlayerCombinations(players, tables)
		g.current = 0
		log.Printf("Created new set of %d rounds from %d players and %d tables", len(g.rounds), len(g.players), len(g.tables))
		return len(g.rounds)
	}
	return 0
}

// Rounds returns the current game rounds (for testing).
func (g *GameRoundGenerator) Rounds() [][]*model.Game {
	g.Lock()
	defer g.Unlock()
	return g.rounds
}

// SortPlayersByNickname sorts tournament players alphabetically by nickname.
// Returns a new slice with the sorted players (does not modify the original).
func SortPlayersByNickname(players []*model.TournamentPlayer) []*model.TournamentPlayer {
	if players == nil {
		return nil
	}
	result := make([]*model.TournamentPlayer, len(players))
	copy(result, players)
	sort.Slice(result, func(p, q int) bool {
		return result[p].Player.Nickname < result[q].Player.Nickname
	})
	return result
}

func isSamePlayers(players1, players2 []*model.TournamentPlayer) bool {
	if len(players1) != len(players2) {
		return false
	}

	sortedPlayers1 := SortPlayersByNickname(players1)
	sortedPlayers2 := SortPlayersByNickname(players2)

	for i := range sortedPlayers1 {
		if sortedPlayers1[i].Player.Nickname != sortedPlayers2[i].Player.Nickname {
			return false
		}
	}

	return true
}

func isSameTables(tables1, tables2 []*model.TournamentTable) bool {
	if len(tables1) != len(tables2) {
		return false
	}

	// Create maps for comparison
	map1 := make(map[uint]bool)
	for _, t := range tables1 {
		map1[t.TableID] = true
	}

	for _, t := range tables2 {
		if !map1[t.TableID] {
			return false
		}
	}

	return true
}

func generatePlayerPairs(players []*model.TournamentPlayer) [][]*model.TournamentPlayer {
	n := len(players)
	pairs := make([][]*model.TournamentPlayer, 0, n*(n-1)/2) // Preallocate for efficiency

	for i := 0; i < n-1; i++ {
		for j := i + 1; j < n; j++ {
			pair := []*model.TournamentPlayer{players[i], players[j]}
			pairs = append(pairs, pair)
		}
	}

	return pairs
}

func generatePlayerPairsCombinations(players []*model.TournamentPlayer) [][][]*model.TournamentPlayer {
	pairs := generatePlayerPairs(players)
	n := len(pairs)
	combinations := make([][][]*model.TournamentPlayer, 0)

	if n > 3 {
		for i := 0; i < n; i++ {
			for j := 0; j < n; j++ {
				if !overlaps(pairs[i], pairs[j]) {
					combination := [][]*model.TournamentPlayer{
						{pairs[i][0], pairs[i][1]},
						{pairs[j][0], pairs[j][1]},
					}
					combinations = append(combinations, combination)
				}
			}
		}
	} else {
		for i := 0; i < n; i++ {
			combination := [][]*model.TournamentPlayer{
				{pairs[i][0], pairs[i][1]},
			}
			combinations = append(combinations, combination)
		}
	}
	return combinations
}

func overlaps(pair1, pair2 []*model.TournamentPlayer) bool {
	for _, p1 := range pair1 {
		for _, p2 := range pair2 {
			if p1.Player.Nickname == p2.Player.Nickname {
				return true
			}
		}
	}
	return false
}

func allGamePlayerCombinations(players []*model.TournamentPlayer, tables []*model.TournamentTable) [][]*model.Game {
	var games [][]*model.Game

	combinations := generatePlayerPairsCombinations(players)
	numberOfCombinations := len(combinations)

	for combinationIndex := 0; combinationIndex < numberOfCombinations; combinationIndex++ {
		round := make([]*model.Game, 0)
		for t, table := range tables {
			playersLeft := len(players) - 4*t
			if playersLeft < 2 {
				break
			}
			for nextIndex := combinationIndex; nextIndex < combinationIndex+numberOfCombinations; nextIndex++ {
				currentIndex := nextIndex % numberOfCombinations
				game := createGame(playersLeft, table, combinations[currentIndex])
				if !hasSamePlayers(&game, round) {
					round = append(round, &game)
					break
				}
			}
		}
		games = append(games, round)
	}
	return games
}

func createGame(playersLeft int, table *model.TournamentTable, combination [][]*model.TournamentPlayer) model.Game {
	var game model.Game
	if playersLeft >= 4 {
		game = model.Game{
			TournamentTable: *table,
			RightPlayerOne:  *combination[0][0],
			RightPlayerTwo:  *combination[0][1],
			LeftPlayerOne:   *combination[1][0],
			LeftPlayerTwo:   *combination[1][1],
		}
	} else {
		game = model.Game{
			TournamentTable: *table,
			RightPlayerOne:  *combination[0][0],
			LeftPlayerOne:   *combination[0][1],
		}
	}
	return game
}

func hasSamePlayers(game *model.Game, round []*model.Game) bool {
	for _, gameInRound := range round {
		for _, playerInRound := range gameInRound.AllPlayers() {
			for _, player := range game.AllPlayers() {
				if playerInRound.Nickname == player.Nickname {
					return true
				}
			}
		}
	}
	return false
}
