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
	current int
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
	var result *model.Game = nil
	if len(c.games) != 0 {
		if c.current >= len(c.games) {
			c.current = 0
		}
		result = c.games[c.current]
		c.current++
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
	pairs := generatePlayerPairs(players)
	n := len(pairs)
	combinations := make([][][]*model.TournamentPlayer, 0)

	if n > 3 {
		for i := 0; i < n-1; i++ {
			for j := i + 1; j < n; j++ {
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

func allGamePlayerCombinations(players []*model.TournamentPlayer, tables []*model.TournamentTable) []*model.Game {
	var games []*model.Game

	playerCombinations := generatePlayerPairsCombinations(players)
	n := len(playerCombinations)
	t := 0

	for c := 0; c < n; c++ {
		if t >= len(tables) {
			t = 0
		}
		tableSize := len(playerCombinations[c])
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
	return games
}
