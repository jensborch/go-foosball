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

	p1 := Player{
		PlayerID: "tt",
		RealName: "Thomas",
	}

	p2 := Player{
		PlayerID: "jj",
		RealName: "Jens",
	}

	g := NewSinglesGame(tournament.Tables[0], &p1, &p2)

	if g.Right()[0].RealName != "Thomas" {
		t.Errorf("Left player must is incorrect, got: %s, want: %s.", g.Right()[0].RealName, "Thomas")
	}
}
