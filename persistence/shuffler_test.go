package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
)

func TestShuffleEmpty(t *testing.T) {

	players := make([]*model.TournamentPlayer, 0)
	previous := make([]*model.Game, 0)
	result := shuffleAndCompare(players, previous)

	if len(result) != 0 {
		t.Errorf("shuffleAndCompare should produce 0 result, got: %d", len(result))
	}
}

func TestShuffleNoHistory(t *testing.T) {

	players := make([]*model.TournamentPlayer, 2)
	players[0] = &model.TournamentPlayer{}
	players[1] = &model.TournamentPlayer{}
	previous := make([]*model.Game, 0)
	result := shuffleAndCompare(players, previous)

	if len(result) != 2 {
		t.Errorf("shuffleAndCompare should produce 2 result, got: %d", len(result))
	}
}

func TestShuffle(t *testing.T) {

	players := make([]*model.TournamentPlayer, 4)
	players[0] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "T1",
		},
	}
	players[1] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "T2",
		},
	}
	players[2] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "T3",
		},
	}
	players[3] = &model.TournamentPlayer{
		Player: model.Player{
			Nickname: "T4",
		},
	}
	previous := make([]*model.Game, 1)
	previous[0] = &model.Game{
		RightPlayerOne: model.TournamentPlayer{
			Player: model.Player{
				Nickname: "T1",
			},
		},
		RightPlayerTwo: model.TournamentPlayer{
			Player: model.Player{
				Nickname: "T2",
			},
		},
		LeftPlayerOne: model.TournamentPlayer{
			Player: model.Player{
				Nickname: "T3",
			},
		},
		LeftPlayerTwo: model.TournamentPlayer{
			Player: model.Player{
				Nickname: "T4",
			},
		},
	}
	result := shuffleAndCompare(players, previous)

	if len(result) != 4 {
		t.Errorf("shuffleAndCompare should produce 24 result, got: %d", len(result))
	}

	if result[0].Player.Nickname == "T1" {
		t.Errorf("shuffleAndCompare should not return previous player, got: %s", result[0].Player.Nickname)
	}
}
