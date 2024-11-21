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

func TestGameCombinationsNext(t *testing.T) {
	tables := make([]*model.TournamentTable, 1)
	tables[0] = &model.TournamentTable{
		Table: model.Table{
			Base: model.Base{
				ID: 1,
			},
		},
	}

	players := make([]*model.TournamentPlayer, 4)
	players[0] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "P1",
		},
	}
	players[1] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "P2",
		},
	}
	players[2] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "P3",
		},
	}
	players[3] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "P4",
		},
	}

	gameCombinations := GetGameCombinationsInstance()

	gameCombinations.Update(players, tables)

	game := gameCombinations.Next()

	if game == nil {
		t.Error("Expected non-nil game")
	}
}
