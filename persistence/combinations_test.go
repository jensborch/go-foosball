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
	tables, players := testData([]string{"P1", "P2", "P3", "P4"})

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
		game := gameCombinations.Next()

		if game == nil {
			t.Errorf("Test %d: Expected non nil game", i+1)
		} else {

			if game.TournamentTable.Table.ID != 1 {
				t.Errorf("Test %d: Expected game to have table ID 1, but got %d", i+1, game.TournamentTable.Table.ID)
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
	tables, players := testData([]string{"P1", "P2", "P3"})

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
		game := gameCombinations.Next()

		if game == nil {
			t.Errorf("Test %d: Expected non nil game", i+1)
		} else {

			if game.TournamentTable.Table.ID != 1 {
				t.Errorf("Test %d: Expected game to have table ID 1, but got %d", i+1, game.TournamentTable.Table.ID)
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

func testData(names []string) ([]*model.TournamentTable, []*model.TournamentPlayer) {
	tables := make([]*model.TournamentTable, 1)
	tables[0] = &model.TournamentTable{
		Table: model.Table{
			Base: model.Base{
				ID: 1,
			},
		},
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
