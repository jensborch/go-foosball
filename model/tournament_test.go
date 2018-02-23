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
	NewPlayer("1", "n1").AddToTournament(tournament)
	NewPlayer("2", "n2").AddToTournament(tournament)
	NewPlayer("3", "n3").AddToTournament(tournament)
	NewPlayer("4", "n4").AddToTournament(tournament)
	NewPlayer("5", "n5").AddToTournament(tournament)

	g := tournament.RandomGames()

	if len(g) != 1 {
		t.Errorf("Number of games is incorrect, got: %d, want: %d.", len(g), 1)
	}
}

func TestRandomGamesTwoTable(t *testing.T) {
	tournament := InitTournament()
	NewPlayer("1", "n1").AddToTournament(tournament)
	NewPlayer("2", "n2").AddToTournament(tournament)
	NewPlayer("3", "n3").AddToTournament(tournament)
	NewPlayer("4", "n4").AddToTournament(tournament)
	NewPlayer("5", "n5").AddToTournament(tournament)
	NewPlayer("6", "n6").AddToTournament(tournament)

	g := tournament.RandomGames()

	if len(g) != 2 {
		t.Errorf("Number of games is incorrect, got: %d, want: %d.", len(g), 2)
	}
}
