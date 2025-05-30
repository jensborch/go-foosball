package persistence

import (
	"fmt"
	"math/rand/v2"
	"sort"
	"sync"

	"github.com/jensborch/go-foosball/model"
)

var (
	once         sync.Once
	instance     map[string]*GameCombinations
	instanceLock sync.Mutex
)

type GameCombinations struct {
	sync.Mutex
	current int
	rounds  [][]*model.Game
	players []*model.TournamentPlayer
}

func GetGameCombinationsInstance(tournamentId string) *GameCombinations {
	fmt.Printf("Getting combinations instance for tournament %s\n", tournamentId)
	once.Do(func() {
		instance = make(map[string]*GameCombinations)
	})
	instanceLock.Lock()
	defer instanceLock.Unlock()

	g, ok := instance[tournamentId]
	if !ok {
		fmt.Printf("Creating new instance for tournament %s\n", tournamentId)
		g = &GameCombinations{}
		instance[tournamentId] = g
	}
	return g
}

func (c *GameCombinations) Next() []*model.Game {
	c.Lock()
	defer c.Unlock()
	var result []*model.Game = nil
	if len(c.rounds) != 0 {
		if c.current >= len(c.rounds) {
			c.current = 0
		}
		result = c.rounds[c.current]
		c.current++
	}
	fmt.Printf("Playing round %d\n", c.current)
	return result
}

func (c *GameCombinations) Randomize() {
	c.Lock()
	defer c.Unlock()
	if c.rounds != nil {
		result := make([][]*model.Game, len(c.rounds))
		perm := rand.Perm(len(c.rounds))
		for i, v := range perm {
			result[v] = c.rounds[i]
		}
		c.rounds = result
	}
}

func (c *GameCombinations) Update(players []*model.TournamentPlayer, tables []*model.TournamentTable) int {
	c.Lock()
	defer c.Unlock()
	if !isSamePlayers(c.players, players) {
		c.players = players
		c.rounds = allGamePlayerCombinations(players, tables)
		c.current = 0
		fmt.Printf("Created new set of %d rounds from %d players\n", len(c.rounds), len(c.players))
		return len(c.rounds)
	}
	return 0
}

func sortPlayersById(players []*model.TournamentPlayer) []*model.TournamentPlayer {
	result := make([]*model.TournamentPlayer, len(players))
	copy(result, players)
	sort.Slice(result, func(i, j int) bool {
		return players[i].ID < players[j].ID
	})
	return result
}

func isSamePlayers(players1, players2 []*model.TournamentPlayer) bool {
	if len(players1) != len(players2) {
		return false
	}

	sortedPlayers1 := sortPlayersByNickname(players1)
	sortedPlayers2 := sortPlayersByNickname(players2)

	for i := range sortedPlayers1 {
		if sortedPlayers1[i].Player.Nickname != sortedPlayers2[i].Player.Nickname {
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
	fmt.Println("hej")
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
			for nextIndex := combinationIndex; ; nextIndex++ {
				if nextIndex == numberOfCombinations {
					nextIndex = 0
				}
				game := createGame(playersLeft, table, combinations[nextIndex])
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
