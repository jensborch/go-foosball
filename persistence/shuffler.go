package persistence

import (
	"log"
	"math/rand"
	"reflect"
	"sort"

	"github.com/jensborch/go-foosball/model"
)

type pair struct {
	first, second *model.TournamentPlayer
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

func shuffleAndCompare(players []*model.TournamentPlayer, previous []*model.Game) []*model.TournamentPlayer {
	const numberOfShuffles = 10
	shuffles := [numberOfShuffles][]*model.TournamentPlayer{}
	for i := 0; i < numberOfShuffles; i++ {
		shuffles[i] = shufflePlayers(players)
	}

	if len(previous) > len(players)/2 {
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
		numberFound += sort.Search(len(oldPairs), func(i int) bool {
			return reflect.DeepEqual(oldPairs[i], pair)
		})
	}
	return numberFound
}

func games2Pairs(games []*model.Game) []*pair {
	log.Printf("Found %d old games", len(games))
	pairs := make([]*pair, len(games)*2)
	for i := 0; i < len(games); i++ {
		p1 := newPair(&games[i].LeftPlayerOne, &games[i].LeftPlayerTwo)
		p2 := newPair(&games[i].RightPlayerOne, &games[i].RightPlayerTwo)
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
