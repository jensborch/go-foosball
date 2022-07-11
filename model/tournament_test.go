package model

import (
	"testing"
)

func TestCreateTournament(t *testing.T) {
	tournament := NewTournament("Test")

	if tournament.Name != "Test" {
		t.Errorf("Tournament name is incorrect, got: %s, want: %s.", tournament.Name, "Test")
	}

	if tournament.InitialRanking != 1500 {
		t.Errorf("Tournament ranking is incorrect, got: %d, want: %d.", tournament.InitialRanking, 1500)
	}

	if tournament.GameScore != 50 {
		t.Errorf("Tournament score is incorrect, got: %d, want: %d.", tournament.GameScore, 50)
	}

}
