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

/*func TestAddPlayer2Tournament(t *testing.T) {
	tournament := InitTournament()
	p1 := NewPlayer("jj", "Jens")

	p1.AddToTournament(tournament)

	if len(p1.TournamentPlayers) != 1 {
		t.Errorf("Tournament must have one player, got: %d.", len(p1.TournamentPlayers))
	}

	p2 := NewPlayer("tt", "Thomas")

	p2.AddToTournament(tournament)

	if len(p2.TournamentPlayers) != 2 {
		t.Errorf("Tournament must have two player, got: %d.", len(p2.TournamentPlayers))
	}
}*/
