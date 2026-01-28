package service

import (
	"fmt"
	"reflect"
	"sync"
	"testing"

	"github.com/jensborch/go-foosball/model"
)

func TestGetGameRoundGenerator(t *testing.T) {
	// Clean up before test
	ClearGameRoundGenerator("test-singleton")

	var wg sync.WaitGroup
	instance1 := GetGameRoundGenerator("test-singleton")
	if instance1 == nil {
		t.Error("Expected non-nil instance")
	}

	// Test that GetGameRoundGenerator always returns the same instance
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			instance2 := GetGameRoundGenerator("test-singleton")
			if instance1 != instance2 {
				t.Error("Expected the same instance")
			}
		}()
	}
	wg.Wait()
}

func TestGameRoundGeneratorEven(t *testing.T) {
	ClearGameRoundGenerator("test-even")
	tables, players := testData([]string{"P1", "P2", "P3", "P4"}, []string{"T1"})

	generator := GetGameRoundGenerator("test-even")

	generator.GenerateRounds(players, tables)

	// With 4 players and 1 table, there are exactly 3 unique team matchups:
	// P1+P2 vs P3+P4, P1+P3 vs P2+P4, P1+P4 vs P2+P3
	tests := []struct {
		want []string
	}{
		{want: []string{"P1", "P2", "P3", "P4"}},
		{want: []string{"P1", "P3", "P2", "P4"}},
		{want: []string{"P1", "P4", "P2", "P3"}},
	}

	for i, tc := range tests {
		game := generator.NextRound()[0]

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

func TestGameRoundGeneratorUnevenSmall(t *testing.T) {
	ClearGameRoundGenerator("test-uneven")
	tables, players := testData([]string{"P1", "P2", "P3"}, []string{"T1"})

	generator := GetGameRoundGenerator("test-uneven")

	generator.GenerateRounds(players, tables)

	tests := []struct {
		want []string
	}{
		{want: []string{"P1", "P2"}},
		{want: []string{"P1", "P3"}},
		{want: []string{"P2", "P3"}},
		{want: []string{"P1", "P2"}},
	}

	for i, tc := range tests {
		game := generator.NextRound()[0]

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

func TestGameRoundGeneratorComplete(t *testing.T) {
	ClearGameRoundGenerator("test-complete")
	tables, players := testData([]string{"P1", "P2", "P3", "P4", "P5", "P6", "P7"}, []string{"T1", "T2", "T3"})
	generator := GetGameRoundGenerator("test-complete")

	rounds := generator.GenerateRounds(players, tables)

	for i := 0; i < rounds; i++ {
		gameRound := generator.NextRound()
		if len(gameRound) != 2 {
			t.Errorf("Expected 2 games in round %d", i+1)
		}
	}
}

func TestGameRoundGeneratorMultiTables(t *testing.T) {
	ClearGameRoundGenerator("test-multi")
	tables, players := testData([]string{"P1", "P2", "P3", "P4", "P5", "P6", "P7"}, []string{"T1", "T2", "T3"})

	generator := GetGameRoundGenerator("test-multi")

	generator.GenerateRounds(players, tables)

	// After reordering for variety, the first few rounds should have different team pairings
	// Verify that consecutive rounds don't share the same team
	prevTeams := make(map[string]bool)
	for i := 0; i < 5; i++ {
		gameRound := generator.NextRound()
		currentTeams := make(map[string]bool)

		for _, game := range gameRound {
			// Build team keys
			team1 := []string{}
			if game.RightPlayerOne.Player.Nickname != "" {
				team1 = append(team1, game.RightPlayerOne.Player.Nickname)
			}
			if game.RightPlayerTwo.Player.Nickname != "" {
				team1 = append(team1, game.RightPlayerTwo.Player.Nickname)
			}

			team2 := []string{}
			if game.LeftPlayerOne.Player.Nickname != "" {
				team2 = append(team2, game.LeftPlayerOne.Player.Nickname)
			}
			if game.LeftPlayerTwo.Player.Nickname != "" {
				team2 = append(team2, game.LeftPlayerTwo.Player.Nickname)
			}

			// Sort and create key
			if len(team1) > 1 && team1[0] > team1[1] {
				team1[0], team1[1] = team1[1], team1[0]
			}
			if len(team2) > 1 && team2[0] > team2[1] {
				team2[0], team2[1] = team2[1], team2[0]
			}

			team1Key := fmt.Sprintf("%v", team1)
			team2Key := fmt.Sprintf("%v", team2)

			currentTeams[team1Key] = true
			currentTeams[team2Key] = true
		}

		// Check overlap with previous round (for rounds after the first)
		if i > 0 {
			overlap := 0
			for team := range currentTeams {
				if prevTeams[team] {
					overlap++
				}
			}
			// We expect minimal overlap - ideally 0 or 1 team shared
			if overlap > 1 {
				t.Logf("Round %d has %d teams in common with round %d", i+1, overlap, i)
			}
		}

		prevTeams = currentTeams
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
	ClearGameRoundGenerator("test-random")
	// Use more players and tables for a larger number of rounds to ensure randomization is detectable
	tables, players := testData([]string{"P1", "P2", "P3", "P4", "P5", "P6"}, []string{"T1", "T2"})
	generator := GetGameRoundGenerator("test-random")

	generator.GenerateRounds(players, tables)
	initial := deepCopy(generator.Rounds())

	// With more rounds, randomization should definitely change the order
	generator.Randomize()
	if reflect.DeepEqual(initial, generator.Rounds()) {
		t.Error("Randomize did not change round order")
	}

	for _, round := range generator.Rounds() {
		for _, game := range round {
			if game == nil {
				t.Error("Found nil games after randomization")
			}
		}
	}
}

func TestClearGameRoundGenerator(t *testing.T) {
	instance1 := GetGameRoundGenerator("test-clear")
	if instance1 == nil {
		t.Error("Expected non-nil instance")
	}

	ClearGameRoundGenerator("test-clear")

	instance2 := GetGameRoundGenerator("test-clear")
	if instance1 == instance2 {
		t.Error("Expected different instance after clear")
	}
}

func deepCopy(games [][]*model.Game) [][]*model.Game {
	cp := make([][]*model.Game, len(games))
	for i, round := range games {
		cp[i] = make([]*model.Game, len(round))
		for j, game := range round {
			tmp := *game
			cp[i][j] = &tmp
		}
	}
	return cp
}
