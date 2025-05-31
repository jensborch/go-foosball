package persistence

import (
	"reflect"
	"sync"
	"testing"

	"github.com/jensborch/go-foosball/model"
)

func TestGetGameCombinationsInstance(t *testing.T) {
	var wg sync.WaitGroup
	instance1 := GetGameCombinationsInstance("test")
	if instance1 == nil {
		t.Error("Expected non-nil instance")
	}

	// Test that GetInstance always returns the same instance
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			instance2 := GetGameCombinationsInstance("test")
			if instance1 != instance2 {
				t.Error("Expected the same instance")
			}
		}()
	}
	wg.Wait()
}

func TestGameCombinationsEven(t *testing.T) {
	tables, players := testData([]string{"P1", "P2", "P3", "P4"}, []string{"T1"})

	gameCombinations := GetGameCombinationsInstance("test")

	gameCombinations.Update(players, tables)

	tests := []struct {
		want []string
	}{
		{want: []string{"P1", "P2", "P3", "P4"}},
		{want: []string{"P1", "P3", "P2", "P4"}},
		{want: []string{"P1", "P4", "P2", "P3"}},
		{want: []string{"P2", "P3", "P1", "P4"}},
		{want: []string{"P2", "P4", "P1", "P3"}},
		{want: []string{"P3", "P4", "P1", "P2"}},
	}

	for i, tc := range tests {
		game := gameCombinations.Next()[0]

		if game == nil {
			t.Errorf("Test %d: Expected non nil game", i+1)
		} else {

			if game.TournamentTable.Table.Name != "T1" {
				t.Errorf("Test %d: Expected game to have table T1, but got %s", i+1, game.TournamentTable.Table.Name)
			}

			if game.RightPlayerOne.Player.Nickname != tc.want[0] {
				t.Errorf("Test %d: Expected right player 1 nickname to be %s, but got %s", i+1, tc.want[0], game.RightPlayerOne.Player.Nickname)
			}

			if game.RightPlayerTwo.Player.Nickname != tc.want[1] {
				t.Errorf("Test %d: Expected right player 2 nickname to be %s, but got %s", i+1, tc.want[1], game.RightPlayerTwo.Player.Nickname)
			}

			if game.LeftPlayerOne.Player.Nickname != tc.want[2] {
				t.Errorf("Test %d: Expected left player 1 nickname to be %s, but got %s", i+1, tc.want[2], game.LeftPlayerOne.Player.Nickname)
			}

			if game.LeftPlayerTwo.Player.Nickname != tc.want[3] {
				t.Errorf("Test %d: Expected left player 2 nickname to be %s, but got %s", i+1, tc.want[3], game.LeftPlayerTwo.Player.Nickname)
			}
		}
	}
}

func TestGameCombinationsUnevenSmall(t *testing.T) {
	tables, players := testData([]string{"P1", "P2", "P3"}, []string{"T1"})

	gameCombinations := GetGameCombinationsInstance("test")

	gameCombinations.Update(players, tables)

	tests := []struct {
		want []string
	}{
		{want: []string{"P1", "P2"}},
		{want: []string{"P1", "P3"}},
		{want: []string{"P2", "P3"}},
		{want: []string{"P1", "P2"}},
	}

	for i, tc := range tests {
		game := gameCombinations.Next()[0]

		if game == nil {
			t.Errorf("Test %d: Expected non nil game", i+1)
		} else {

			if game.TournamentTable.Table.Name != "T1" {
				t.Errorf("Test %d: Expected game to have table T1, but got %s", i+1, game.TournamentTable.Table.Name)
			}

			if game.RightPlayerOne.Player.Nickname != tc.want[0] {
				t.Errorf("Test %d: Expected right player 1 nickname to be %s, but got %s", i+1, tc.want[0], game.RightPlayerOne.Player.Nickname)
			}

			if game.RightPlayerTwo.Player.Nickname != "" {
				t.Errorf("Test %d: Expected right player 2 be empty, but got %s", i+1, game.RightPlayerTwo.Player.Nickname)
			}

			if game.LeftPlayerOne.Player.Nickname != tc.want[1] {
				t.Errorf("Test %d: Expected left player 1 nickname to be %s, but got %s", i+1, tc.want[1], game.LeftPlayerOne.Player.Nickname)
			}

			if game.LeftPlayerTwo.Player.Nickname != "" {
				t.Errorf("Test %d: Expected left player 2 nickname to be empty, but got %s", i+1, game.LeftPlayerTwo.Player.Nickname)
			}
		}
	}
}

func TestGameCombinationsComplete(t *testing.T) {
	tables, players := testData([]string{"P1", "P2", "P3", "P4", "P5", "P6", "P7"}, []string{"T1", "T2", "T3"})
	gameCombinations := GetGameCombinationsInstance("test")

	rounds := gameCombinations.Update(players, tables)

	for i := 0; i < rounds; i++ {
		gameRound := gameCombinations.Next()
		if len(gameRound) != 2 {
			t.Errorf("Expected 2 games in round %d", i+1)
		}

	}
}

func TestGameCombinationsMultiTables(t *testing.T) {
	tables, players := testData([]string{"P1", "P2", "P3", "P4", "P5", "P6", "P7"}, []string{"T1", "T2", "T3"})

	gameCombinations := GetGameCombinationsInstance("test")

	gameCombinations.Update(players, tables)

	tests := []struct {
		want [][]string
	}{
		{want: [][]string{{"P1", "P2", "P3", "P4"}, {"P5", "", "P6", ""}}},
		{want: [][]string{{"P1", "P2", "P3", "P5"}, {"P4", "", "P6", ""}}},
		{want: [][]string{{"P1", "P2", "P3", "P6"}, {"P4", "", "P5", ""}}},
	}
	for testIndex, test := range tests {
		gameRound := gameCombinations.Next()
		for tableIndex, table := range test.want {

			if gameRound[tableIndex].TournamentTable.Table.Name != tables[tableIndex].Table.Name {
				t.Errorf("Test %d:%d: Expected game to have table %s, but got %s",
					testIndex+1, tableIndex+1,
					tables[tableIndex].Table.Name,
					gameRound[tableIndex].TournamentTable.Table.Name)
			}

			if gameRound[tableIndex].RightPlayerOne.Player.Nickname != table[0] {
				t.Errorf("Test %d:%d: Expected right player 1 nickname to be %s, but got %s",
					testIndex+1,
					tableIndex+1,
					table[0],
					gameRound[tableIndex].RightPlayerOne.Player.Nickname)
			}

			if gameRound[tableIndex].RightPlayerTwo.Player.Nickname != table[1] {
				t.Errorf("Test %d:%d: Expected right player 2 nickname to be %s, but got %s",
					testIndex+1, tableIndex+1,
					table[1],
					gameRound[tableIndex].RightPlayerTwo.Player.Nickname)
			}

			if gameRound[tableIndex].LeftPlayerOne.Player.Nickname != table[2] {
				t.Errorf("Test %d:%d: Expected left player 1 nickname to be %s, but got %s",
					testIndex+1,
					tableIndex+1,
					table[2],
					gameRound[tableIndex].LeftPlayerOne.Player.Nickname)
			}

			if gameRound[tableIndex].LeftPlayerTwo.Player.Nickname != table[3] {
				t.Errorf("Test %d:%d: Expected left player 2 nickname to be %s, but got %s",
					testIndex+1,
					tableIndex+1,
					table[3],
					gameRound[tableIndex].LeftPlayerTwo.Player.Nickname)
			}
		}
	}
}

func testData(names []string, tablesName []string) ([]*model.TournamentTable, []*model.TournamentPlayer) {
	tables := make([]*model.TournamentTable, len(tablesName))
	for i, n := range tablesName {
		tables[i] = &model.TournamentTable{
			Table: model.Table{
				Name: n,
			},
		}
	}

	players := make([]*model.TournamentPlayer, len(names))
	for i, n := range names {
		players[i] = &model.TournamentPlayer{
			Player: model.Player{
				Nickname: n,
			},
		}
	}

	return tables, players
}

func TestRandomize(t *testing.T) {
	tables, players := testData([]string{"P1", "P2", "P3", "P4"}, []string{"T1"})
	gameCombos := GetGameCombinationsInstance("test")

	gameCombos.Update(players, tables)
	initial := deepCopy(gameCombos.rounds)

	gameCombos.Randomize()
	if reflect.DeepEqual(initial, gameCombos.rounds) {
		t.Error("Randomize did not change round order")
	}

	for _, round := range gameCombos.rounds {
		for _, game := range round {
			if game == nil {
				t.Error("Found nil games after randomization")
			}
		}
	}
}

func deepCopy(games [][]*model.Game) [][]*model.Game {
	copy := make([][]*model.Game, len(games))
	for i, round := range games {
		copy[i] = make([]*model.Game, len(round))
		for j, game := range round {
			tmp := *game
			copy[i][j] = &tmp
		}
	}
	return copy
}
