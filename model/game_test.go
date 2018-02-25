package model

import (
	"testing"
)

func initSingleGame(tournament *Tournament) *Game {
	g := NewGame(tournament.TournamentTables[0])
	g.AddPlayer(*NewPlayer("tt", "Thomas"))
	g.AddPlayer(*NewPlayer("jj", "Jens"))
	return g
}

func initDuroGame(tournament *Tournament) *Game {
	g := NewGame(tournament.TournamentTables[0])
	g.AddPlayer(*NewPlayer("tt", "Thomas"))
	g.AddPlayer(*NewPlayer("rr", "Rikke"))
	g.AddPlayer(*NewPlayer("jj", "Jens"))
	g.AddPlayer(*NewPlayer("kk", "Kristine"))
	return g
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

	if g.Winner != "" {
		t.Errorf("There should be no winner yet, got: %s.", g.Winner)
	}

	g.Winner = RIGHT

	if g.Winner != RIGHT {
		t.Errorf("Right should be winner, got: %s.", g.Winner)
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
