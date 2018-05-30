package model

import (
	"testing"
)

func TestCreatePlayer(t *testing.T) {
	p := NewPlayer("jj", "Jens")

	if p.Nickname != "jj" {
		t.Errorf("Player nickname is incorrect, got: %s, want: %s.", p.Nickname, "jj")
	}

	if p.RealName != "Jens" {
		t.Errorf("Player name is incorrect, got: %s, want: %s.", p.RealName, "Jens")
	}

	if p.RFID != "" {
		t.Errorf("Player RFID must be empty")
	}

}

func TestCreateTournamentPlayer(t *testing.T) {
	p := NewPlayer("jj", "Jens")
	tournament := InitTournament()
	tp := NewTournamentPlayer(p, *tournament)

	if r := tp.Ranking; r != 1500 {
		t.Errorf("Player should have initial ranking, got %d, want: %d.", r, 1500)
	}

	if r := tp.Tournament.InitialRanking; r != 1500 {
		t.Errorf("Tournament should have initial ranking, got %d, want: %d.", r, 1500)
	}

	if n := tp.Player.Nickname; n != "jj" {
		t.Errorf("Player nickname is incorrect, got: %s, want: %s.", n, "jj")
	}

	if l := len(tp.Player.TournamentPlayers); l != 1 {
		t.Errorf("Player should have one tournament player, got: %d.", l)
	}

	if !p.IsActive(tournament.UUID) {
		t.Error("Player should be active")
	}

	if s, e := p.GetScore(tournament.UUID); e != nil {
		t.Error("Player should have score")
		if s != 1500 {
			t.Errorf("Player should have score of 1500, but got: %d", s)
		}
	}
}
