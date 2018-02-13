package model

import (
	"testing"
)

const TOURNAMENT = "T1"

func initTournament() *Tournament {
	table1 := NewTable("1", Color{Right: "red", Left: "green"})
	table2 := NewTable("2", Color{Right: "black", Left: "blue"})
	return NewTournament(TOURNAMENT, table1, table2)
}

func TestCreateTournament(t *testing.T) {
	tournament := initTournament()
	if tournament.Name != TOURNAMENT {
		t.Errorf("Tournament name is incorrect, got: %s, want: %s.", tournament.Name, TOURNAMENT)
	}
}

func TestAddTables2Tournament(t *testing.T) {
	tournament := initTournament()
	tournament.AddTables(NewTable("3", Color{Right: "black", Left: "blue"}))

	if len(tournament.TournamentTables) != 3 {
		t.Errorf("Number of tables is incorrect, got: %d, want: %d.", len(tournament.TournamentTables), 3)
	}
}
