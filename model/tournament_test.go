package model

import (
	"testing"
)

const TOURNAMENT = "T1"

func InitTournament() *Tournament {
	table1 := NewTable("1", Color{Right: "red", Left: "green"})
	table2 := NewTable("2", Color{Right: "black", Left: "blue"})
	return NewTournament(TOURNAMENT, *table1, *table2)
}

func TestCreateTournament(t *testing.T) {
	tournament := InitTournament()
	if tournament.Name != TOURNAMENT {
		t.Errorf("Tournament name is incorrect, got: %s, want: %s.", tournament.Name, TOURNAMENT)
	}
}

func TestAddTables2Tournament(t *testing.T) {
	tournament := InitTournament()
	tournament.AddTables(*NewTable("3", Color{Right: "black", Left: "blue"}))

	if len(tournament.TournamentTables) != 3 {
		t.Errorf("Number of tables is incorrect, got: %d, want: %d.", len(tournament.TournamentTables), 3)
	}
}

func TestRandomGamesOneTable(t *testing.T) {
	tournament := InitTournament()
	tournament.AddPlayer(NewPlayer("1", "n1", "rfid"))
	tournament.AddPlayer(NewPlayer("2", "n2", "rfid"))
	tournament.AddPlayer(NewPlayer("3", "n3", "rfid"))
	tournament.AddPlayer(NewPlayer("4", "n4", "rfid"))
	tournament.AddPlayer(NewPlayer("5", "n5", "rfid"))

	g := tournament.RandomGames()

	if len(g) != 1 {
		t.Errorf("Number of games is incorrect, got: %d, want: %d.", len(g), 1)
	}

	if s := g[0].GetOrCalculateRightScore(); s != 25 {
		t.Errorf("Score should be something, got: %d, want: %d.", s, 25)
	}
}

func TestRandomGamesTwoTable(t *testing.T) {
	tournament := InitTournament()
	tournament.AddPlayer(NewPlayer("1", "n1", "rfid"))
	tournament.AddPlayer(NewPlayer("2", "n2", "rfid"))
	tournament.AddPlayer(NewPlayer("3", "n3", "rfid"))
	tournament.AddPlayer(NewPlayer("4", "n4", "rfid"))
	tournament.AddPlayer(NewPlayer("5", "n5", "rfid"))
	tournament.AddPlayer(NewPlayer("6", "n6", "rfid"))

	g := tournament.RandomGames()

	if len(g) != 2 {
		t.Errorf("Number of games is incorrect, got: %d, want: %d.", len(g), 2)
	}
}

func TestAddPlayer2Tournament(t *testing.T) {
	tournament := InitTournament()
	p1 := NewPlayer("jj", "Jens", "rfid")

	tournament.AddPlayer(p1)

	if len(p1.TournamentPlayers) != 1 {
		t.Errorf("Tournament must have one player, got: %d.", len(p1.TournamentPlayers))
	}

	p2 := NewPlayer("tt", "Thomas", "rfid")

	tournament.AddPlayer(p2)

	if len(tournament.TournamentPlayers) != 2 {
		t.Errorf("Tournament must have two player, got: %d.", len(tournament.TournamentPlayers))
	}
}

func TestDeactivatePlayerInTournament(t *testing.T) {
	tournament := InitTournament()
	p := NewPlayer("jj", "Jens", "rfid")
	tournament.AddPlayer(p)

	if !p.TournamentPlayers[0].Active {
		t.Errorf("Player should be active")
	}

	if !tournament.DeactivatePlayer(p.Nickname) {
		t.Errorf("Player should be in tournament")
	}

	if tournament.TournamentPlayers[0].Active {
		t.Errorf("Player should not be active")
	}
}
