package model

import (
	"testing"
)

func initSingleGame(tournament *Tournament) *Game {
	p1 := NewPlayer("tt", "Thomas")
	p2 := NewPlayer("jj", "Jens")
	return NewSinglesGame(tournament.TournamentTables[0], p1, p2)
}

func initDuroGame(tournament *Tournament) *Game {
	p1 := NewPlayer("tt", "Thomas")
	p2 := NewPlayer("jj", "Jens")
	p3 := NewPlayer("rr", "Rikke")
	p4 := NewPlayer("kk", "Kristine")
	return NewDuroGame(tournament.TournamentTables[0], PlayerPair{First: p1, Second: p2}, PlayerPair{First: p3, Second: p4})
}

func TestCreateSingleGame(t *testing.T) {
	g := initSingleGame(InitTournament())

	if len(g.UUID) != 36 {
		t.Errorf("Player should have UUID, got: %s", g.UUID)
	}

	if g.Right()[0].RealName != "Thomas" {
		t.Errorf("Right player is incorrect, got: %s, want: %s.", g.Right()[0].RealName, "Thomas")
	}

	if g.Left()[0].RealName != "Jens" {
		t.Errorf("Left player is incorrect, got: %s, want: %s.", g.Left()[0].RealName, "Jens")
	}

	if g.TournamentTable.Table.Name != "1" {
		t.Errorf("Table is incorrect, got: %s, want: %s.", g.TournamentTable.Table.Name, "1")
	}
}

func TestCreateDuroGame(t *testing.T) {
	g := initDuroGame(InitTournament())

	if len(g.UUID) != 36 {
		t.Errorf("Player should have UUID, got: %s", g.UUID)
	}

	if g.Right()[1].RealName != "Jens" {
		t.Errorf("Right player is incorrect, got: %s, want: %s.", g.Right()[1].RealName, "Jens")
	}

	if g.Left()[1].RealName != "Kristine" {
		t.Errorf("Left player is incorrect, got: %s, want: %s.", g.Left()[1].RealName, "Kristine")
	}

	if g.TournamentTable.Table.Name != "1" {
		t.Errorf("Table is incorrect, got: %s, want: %s.", g.TournamentTable.Table.Name, "1")
	}
}
