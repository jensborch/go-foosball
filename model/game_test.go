package model

import (
	"fmt"
	"testing"
)

func TestCreate(t *testing.T) {
	table1 := NewTable("1", Color{Right: "red", Left: "green"})
	table2 := NewTable("2", Color{Right: "black", Left: "blue"})
	tournament := NewTournament("Foosball tournament 1", []*Table{table1, table2})
	fmt.Println(tournament)

	p1 := NewPlayer("tt", "Thomas")

	p2 := NewPlayer("jj", "Jens")

	g := NewSinglesGame(tournament.TournamentTables[0], p1, p2)

	if g.Right()[0].RealName != "Thomas" {
		t.Errorf("Left player must is incorrect, got: %s, want: %s.", g.Right()[0].RealName, "Thomas")
	}

	if g.Left()[0].RealName != "Jens" {
		t.Errorf("Left player must is incorrect, got: %s, want: %s.", g.Left()[0].RealName, "Jens")
	}

	if g.TournamentTable().Table.Name != "1" {
		t.Errorf("Table is incorrect, got: %s, want: %s.", g.TournamentTable().Table.Name, "1")
	}
}
