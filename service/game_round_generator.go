package service

import (
	"fmt"
	"log"
	"math/rand/v2"
	"sort"
	"strings"
	"sync"

	"github.com/jensborch/go-foosball/model"
)

var (
	generators    = make(map[string]*GameRoundGenerator)
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
	numberOfRounds := len(g.rounds)

	if numberOfRounds == 0 {
		log.Printf("No rounds to play")
		return nil
	}

	if g.current >= numberOfRounds {
		g.current = 0
	}
	result := g.rounds[g.current]
	g.current++
	log.Printf("Playing round %d of %d", g.current, numberOfRounds)
	return result
}

// Randomize shuffles the order of rounds using Fisher-Yates algorithm.
func (g *GameRoundGenerator) Randomize() {
	g.Lock()
	defer g.Unlock()
	numberOfRounds := len(g.rounds)

	if numberOfRounds == 0 {
		return
	}

	result := make([][]*model.Game, numberOfRounds)
	perm := rand.Perm(numberOfRounds)
	for i, v := range perm {
		result[i] = g.rounds[v]
	}
	g.rounds = result
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

// isSamePlayers checks if two player slices contain the same players by nickname.
func isSamePlayers(players1, players2 []*model.TournamentPlayer) bool {
	if len(players1) != len(players2) {
		return false
	}

	sortedPlayers1 := model.SortPlayersByNickname(players1)
	sortedPlayers2 := model.SortPlayersByNickname(players2)

	for i := range sortedPlayers1 {
		if sortedPlayers1[i].Player.Nickname != sortedPlayers2[i].Player.Nickname {
			return false
		}
	}
	return true
}

// isSameTables checks if two table slices contain the same tables by ID.
func isSameTables(tables1, tables2 []*model.TournamentTable) bool {
	if len(tables1) != len(tables2) {
		return false
	}

	tableIDs := make(map[uint]bool, len(tables1))
	for _, t := range tables1 {
		tableIDs[t.TableID] = true
	}

	for _, t := range tables2 {
		if !tableIDs[t.TableID] {
			return false
		}
	}
	return true
}

// generatePlayerPairs creates all unique pairs of players.
// For n players, generates n*(n-1)/2 pairs.
func generatePlayerPairs(players []*model.TournamentPlayer) [][]*model.TournamentPlayer {
	n := len(players)
	pairs := make([][]*model.TournamentPlayer, 0, n*(n-1)/2)

	for i := 0; i < n-1; i++ {
		for j := i + 1; j < n; j++ {
			pairs = append(pairs, []*model.TournamentPlayer{players[i], players[j]})
		}
	}
	return pairs
}

// generatePlayerPairsCombinations creates all valid team matchup combinations.
// For 4+ players: generates all pairs of non-overlapping teams (4 players per game).
// For 2-3 players: generates single-pair games (2 players per game).
func generatePlayerPairsCombinations(players []*model.TournamentPlayer) [][][]*model.TournamentPlayer {
	pairs := generatePlayerPairs(players)
	n := len(pairs)
	combinations := make([][][]*model.TournamentPlayer, 0)

	if n > 3 {
		// 4+ players: create team vs team matchups
		for i := 0; i < n; i++ {
			for j := 0; j < n; j++ {
				if !pairsOverlap(pairs[i], pairs[j]) {
					combinations = append(combinations, [][]*model.TournamentPlayer{
						pairs[i],
						pairs[j],
					})
				}
			}
		}
	} else {
		// 2-3 players: single pair games
		for i := 0; i < n; i++ {
			combinations = append(combinations, [][]*model.TournamentPlayer{pairs[i]})
		}
	}
	return combinations
}

// pairsOverlap checks if two player pairs share any common player.
func pairsOverlap(pair1, pair2 []*model.TournamentPlayer) bool {
	for _, p1 := range pair1 {
		for _, p2 := range pair2 {
			if p1.Player.Nickname == p2.Player.Nickname {
				return true
			}
		}
	}
	return false
}

// allGamePlayerCombinations generates all unique game rounds for the given players and tables.
// It creates rounds where each table has a game with non-overlapping players,
// removes duplicate rounds, and reorders for team variety.
func allGamePlayerCombinations(players []*model.TournamentPlayer, tables []*model.TournamentTable) [][]*model.Game {
	combinations := generatePlayerPairsCombinations(players)
	numCombinations := len(combinations)
	usedRounds := make(map[string]bool)
	var rounds [][]*model.Game

	for startIdx := 0; startIdx < numCombinations; startIdx++ {
		round := buildRound(players, tables, combinations, startIdx, numCombinations)

		roundKey := roundKeyFromGames(round)
		if !usedRounds[roundKey] {
			usedRounds[roundKey] = true
			rounds = append(rounds, round)
		}
	}

	return reorderRoundsForVariety(rounds)
}

// buildRound creates a single round of games, one per table with non-overlapping players.
func buildRound(players []*model.TournamentPlayer, tables []*model.TournamentTable,
	combinations [][][]*model.TournamentPlayer, startIdx, numCombinations int) []*model.Game {

	round := make([]*model.Game, 0, len(tables))

	for tableIdx, table := range tables {
		playersLeft := len(players) - 4*tableIdx
		if playersLeft < 2 {
			break
		}

		for offset := 0; offset < numCombinations; offset++ {
			combIdx := (startIdx + offset) % numCombinations
			game := createGame(playersLeft, table, combinations[combIdx])
			if !roundHasPlayer(&game, round) {
				round = append(round, &game)
				break
			}
		}
	}
	return round
}

// reorderRoundsForVariety reorders rounds so that consecutive rounds don't share the same team pairings.
// Uses a greedy algorithm to select the next round with minimal team overlap.
func reorderRoundsForVariety(rounds [][]*model.Game) [][]*model.Game {
	if len(rounds) <= 1 {
		return rounds
	}

	result := make([][]*model.Game, 0, len(rounds))
	remaining := make([][]*model.Game, len(rounds))
	copy(remaining, rounds)

	result = append(result, remaining[0])
	remaining = remaining[1:]

	for len(remaining) > 0 {
		lastTeams := extractTeamKeys(result[len(result)-1])
		bestIdx := findLeastOverlapRound(lastTeams, remaining)

		result = append(result, remaining[bestIdx])
		remaining = append(remaining[:bestIdx], remaining[bestIdx+1:]...)
	}

	return result
}

// findLeastOverlapRound finds the index of the round with minimal team overlap.
func findLeastOverlapRound(lastTeams []string, remaining [][]*model.Game) int {
	bestIdx := 0
	bestOverlap := len(lastTeams) + 1

	for i, round := range remaining {
		teams := extractTeamKeys(round)
		overlap := countOverlap(lastTeams, teams)
		if overlap < bestOverlap {
			bestOverlap = overlap
			bestIdx = i
		}
	}
	return bestIdx
}

// extractTeamKeys extracts all team keys from a round for comparison.
func extractTeamKeys(round []*model.Game) []string {
	teams := make([]string, 0, len(round)*2)
	for _, game := range round {
		if key := teamKey(game.RightPlayerOne, game.RightPlayerTwo); key != "" {
			teams = append(teams, key)
		}
		if key := teamKey(game.LeftPlayerOne, game.LeftPlayerTwo); key != "" {
			teams = append(teams, key)
		}
	}
	return teams
}

// teamKey creates a sorted key for a team of one or two players.
func teamKey(p1, p2 model.TournamentPlayer) string {
	names := make([]string, 0, 2)
	if p1.Player.Nickname != "" {
		names = append(names, p1.Player.Nickname)
	}
	if p2.Player.Nickname != "" {
		names = append(names, p2.Player.Nickname)
	}
	if len(names) == 0 {
		return ""
	}
	sort.Strings(names)
	return strings.Join(names, "+")
}

// countOverlap counts how many strings appear in both slices.
func countOverlap(slice1, slice2 []string) int {
	overlap := 0
	for _, s1 := range slice1 {
		for _, s2 := range slice2 {
			if s1 == s2 {
				overlap++
				break
			}
		}
	}
	return overlap
}

// roundKeyFromGames creates a unique key for a round based on the team matchups in each game.
// This ensures rounds with identical team matchups are detected as duplicates,
// while preserving different team arrangements of the same players.
func roundKeyFromGames(round []*model.Game) string {
	gameKeys := make([]string, len(round))
	for i, game := range round {
		team1Key := teamKey(game.RightPlayerOne, game.RightPlayerTwo)
		team2Key := teamKey(game.LeftPlayerOne, game.LeftPlayerTwo)

		// Normalize order so P1+P2 vs P3+P4 equals P3+P4 vs P1+P2
		if team1Key > team2Key {
			team1Key, team2Key = team2Key, team1Key
		}

		gameKeys[i] = fmt.Sprintf("%s:%s-%s", game.TournamentTable.Table.Name, team1Key, team2Key)
	}
	sort.Strings(gameKeys)
	return strings.Join(gameKeys, "|")
}

// createGame builds a game from a player combination.
// Uses 4-player format if enough players remain, otherwise 2-player format.
func createGame(playersLeft int, table *model.TournamentTable, combination [][]*model.TournamentPlayer) model.Game {
	if playersLeft >= 4 {
		return model.Game{
			TournamentTable: *table,
			RightPlayerOne:  *combination[0][0],
			RightPlayerTwo:  *combination[0][1],
			LeftPlayerOne:   *combination[1][0],
			LeftPlayerTwo:   *combination[1][1],
		}
	}
	return model.Game{
		TournamentTable: *table,
		RightPlayerOne:  *combination[0][0],
		LeftPlayerOne:   *combination[0][1],
	}
}

// roundHasPlayer checks if any player in the game is already playing in the round.
func roundHasPlayer(game *model.Game, round []*model.Game) bool {
	gamePlayers := game.AllPlayers()
	for _, existing := range round {
		for _, existingPlayer := range existing.AllPlayers() {
			for _, player := range gamePlayers {
				if existingPlayer.Nickname == player.Nickname {
					return true
				}
			}
		}
	}
	return false
}
