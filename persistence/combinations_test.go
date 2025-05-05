package persistence

import (
	"sync"
	"testing"

	"github.com/jensborch/go-foosball/model"
)

func TestGetGameCombinationsInstance(t *testing.T) {
	var wg sync.WaitGroup
	instance1 := GetGameCombinationsInstance()
	if instance1 == nil {
		t.Error("Expected non-nil instance")
	}

	// Test that GetInstance always returns the same instance
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			instance2 := GetGameCombinationsInstance()
			if instance1 != instance2 {
				t.Error("Expected the same instance")
			}
		}()
	}
	wg.Wait()
}

func TestGameCombinationsEven(t *testing.T) {
	tables, players := testData([]string{"P1", "P2", "P3", "P4"}, []string{"T1"})

	gameCombinations := GetGameCombinationsInstance()

	gameCombinations.Update(players, tables)

	tests := []struct {
		want []string
	}{
		{want: []string{"P1", "P2", "P3", "P4"}},
		{want: []string{"P1", "P3", "P2", "P4"}},
		{want: []string{"P1", "P4", "P2", "P3"}},
		{want: []string{"P1", "P2", "P3", "P4"}},
		{want: []string{"P1", "P3", "P2", "P4"}},
		{want: []string{"P1", "P4", "P2", "P3"}},
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

	gameCombinations := GetGameCombinationsInstance()

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

func TestGameCombinationsMultiTables(t *testing.T) {
	tables, players := testData([]string{"P1", "P2", "P3", "P4", "P5", "P6", "P7"}, []string{"T1", "T2", "T3"})

	gameCombinations := GetGameCombinationsInstance()

	gameCombinations.Update(players, tables)

	tests := []struct {
		want [][]string
	}{
		{want: [][]string{{"P1", "P2", "P3", "P4"}, {"P6", "", "P7", ""}}},
	}

	for i, tc := range tests {
		for j := range tc.want {
			game := gameCombinations.Next()

			for tableNumber, g := range game {

				if g.TournamentTable.Table.Name != tables[tableNumber].Table.Name {
					t.Errorf("Test %d:%d: Expected game to have table %s, but got %s", i+1, j+1, tables[tableNumber].Table.Name, g.TournamentTable.Table.Name)
				}

				/*if g.RightPlayerOne.Player.Nickname != p[0] {
					t.Errorf("Test %d:%d: Expected right player 1 nickname to be %s, but got %s", i+1, j+1, p[0], g.RightPlayerOne.Player.Nickname)
				}

				if g.RightPlayerTwo.Player.Nickname != p[1] {
					t.Errorf("Test %d:%d: Expected right player 2 nickname to be %s, but got %s", i+1, j+1, p[1], g.RightPlayerTwo.Player.Nickname)
				}

				if g.LeftPlayerOne.Player.Nickname != p[2] {
					t.Errorf("Test %d:%d: Expected left player 1 nickname to be %s, but got %s", i+1, j+1, p[2], g.LeftPlayerOne.Player.Nickname)
				}

				if g.LeftPlayerTwo.Player.Nickname != p[3] {
					t.Errorf("Test %d:%d: Expected left player 2 nickname to be %s, but got %s", i+1, j+1, p[3], g.LeftPlayerTwo.Player.Nickname)
				}*/
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
