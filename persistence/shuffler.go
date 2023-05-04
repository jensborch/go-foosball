package persistence

import (
	"log"
	"math"
	"math/rand"
	"sort"

	"github.com/jensborch/go-foosball/model"
)

type pair struct {
	first, second *model.TournamentPlayer
}

func (r *pair) equals(other *pair) bool {
	if other == nil {
		return false
	}
	return (equals(r.first, other.first) && equals(r.second, other.second)) ||
		(equals(r.second, other.first) && equals(r.first, other.second))
}

func equals(first *model.TournamentPlayer, second *model.TournamentPlayer) bool {
	return (first != nil && second != nil && first.ID == second.ID) || (first == nil && second == nil)
}

func shufflePlayers(players []*model.TournamentPlayer) []*model.TournamentPlayer {
	rand.Shuffle(len(players), func(i, j int) {
		players[i], players[j] = players[j], players[i]
	})
	length := len(players)
	if length%2 != 0 {
		players = players[:length-1]
	}
	return players
}

func tables(players []*model.TournamentPlayer) int {
	return int(math.Ceil(float64(len(players)) / float64(4)))
}

func shuffleAndCompare(players []*model.TournamentPlayer, previous []*model.Game) []*model.TournamentPlayer {
	const numberOfShuffles = 10
	shuffles := [numberOfShuffles][]*model.TournamentPlayer{}
	for i := 0; i < numberOfShuffles; i++ {
		shuffles[i] = shufflePlayers(players)
	}

	if len(previous) > tables(players) {
		previous = previous[0 : len(players)/2]
	}
	matches := make([]int, numberOfShuffles)
	previousPairs := games2Pairs(previous)
	for i, shuffle := range shuffles {
		matches[i] = comparPairs(playerPairs(shuffle), previousPairs)
	}
	sort.Ints(matches)
	minIndex := sort.SearchInts(matches, matches[0])
	return shuffles[minIndex]
}

func newPair(first *model.TournamentPlayer, second *model.TournamentPlayer) *pair {
	return &pair{
		first:  first,
		second: second,
	}
}

func playerPairs(players []*model.TournamentPlayer) []*pair {
	pairs := make([]*pair, len(players)/2)
	for i := 0; i < len(players)-1; i = i + 2 {
		x := i / 2
		pairs[x] = newPair(players[i], players[i+1])
	}
	return pairs
}

func comparPairs(newPairs []*pair, oldPairs []*pair) int {
	var numberFound int
	for _, pair := range newPairs {
		count := 0
		for i := 0; i < len(oldPairs); i++ {
			//if reflect.DeepEqual(pair, oldPairs[i]) {
			if pair.equals(oldPairs[i]) {
				log.Printf("Found match:\n")
				log.Printf("New pair %s:%s\n", pair.first.Player.Nickname, pair.second.Player.Nickname)
				log.Printf("Old pair #%d %s:%s\n", i, oldPairs[i].first.Player.Nickname, oldPairs[i].second.Player.Nickname)
				count++
			}
		}
	}
	return numberFound
}

func games2Pairs(games []*model.Game) []*pair {
	log.Printf("Found %d old games", len(games))
	pairs := make([]*pair, len(games)*2)
	for i := 0; i < len(games); i++ {
		p1 := newPair(&games[i].RightPlayerOne, &games[i].RightPlayerTwo)
		p2 := newPair(&games[i].LeftPlayerOne, &games[i].LeftPlayerTwo)
		pairs[i] = p1
		pairs[i+1] = p2
	}
	return pairs
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
