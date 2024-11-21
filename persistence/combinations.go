package persistence

import (
	"sort"
	"sync"

	"github.com/jensborch/go-foosball/model"
)

var (
	once     sync.Once
	instance *GameCombinations
)

type GameCombinations struct {
	sync.Mutex
	current uint
	games   []*model.Game
	players []*model.TournamentPlayer
}

func GetGameCombinationsInstance() *GameCombinations {
	once.Do(func() {
		instance = &GameCombinations{}
	})
	return instance
}

func (c *GameCombinations) Next() *model.Game {
	c.Lock()
	defer c.Unlock()
	result := c.games[c.current]
	if c.current == uint(len(c.games)-1) {
		c.current++
	} else {
		c.current = 0
	}
	return result
}

func (c *GameCombinations) Update(players []*model.TournamentPlayer, tables []*model.TournamentTable) {
	c.Lock()
	defer c.Unlock()
	if !isSamePlayers(c.players, players) {
		c.players = players
		c.games = allGamePlayerCombinations(players, tables)
		c.current = 0
	}
}

func isSamePlayers(players1, players2 []*model.TournamentPlayer) bool {
	if len(players1) != len(players2) {
		return false
	}

	// Sort the arrays
	sort.Slice(players1, func(i, j int) bool {
		return players1[i].ID < players1[j].ID
	})
	sort.Slice(players2, func(i, j int) bool {
		return players2[i].ID < players2[j].ID
	})

	for i := range players1 {
		if players1[i] != players2[i] {
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
	playerCombinations := generatePlayerPairs(players)
	n := len(playerCombinations)

	combinations := make([][][]*model.TournamentPlayer, 0, n*(n-1)/2) // Preallocate for efficiency

	for c := 0; c < n-1; c++ {
		for i := c; i < n; i++ {
			combination := [][]*model.TournamentPlayer{playerCombinations[c], playerCombinations[i]}
			combinations = append(combinations, combination)
		}
	}
	return combinations
}

func allGamePlayerCombinations(players []*model.TournamentPlayer, tables []*model.TournamentTable) []*model.Game {
	var games []*model.Game

	playerCombinations := generatePlayerPairsCombinations(players)
	n := len(playerCombinations)

	for c := 0; c < n-1; c = c + 4 {
		for t := 0; t < len(tables); t++ {
			tableSize := len(playerCombinations[c+t])
			if tableSize == 2 {
				game := model.Game{
					TournamentTable: *tables[t],
					RightPlayerOne:  *playerCombinations[c+t][0][0],
					RightPlayerTwo:  *playerCombinations[c+t][0][1],
					LeftPlayerOne:   *playerCombinations[c+t][1][0],
					LeftPlayerTwo:   *playerCombinations[c+t][1][1],
				}
				games = append(games, &game)
			} else {
				game := model.Game{
					TournamentTable: *tables[t],
					RightPlayerOne:  *playerCombinations[c+t][0][0],
					LeftPlayerOne:   *playerCombinations[c+t][0][1],
				}
				games = append(games, &game)
			}
		}
	}

	return games
}
