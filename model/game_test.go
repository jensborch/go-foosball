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

func TestInitialGameScore(t *testing.T) {
	g := initSingleGame(InitTournament())
	s1, s2 := g.GameScore()

	if s1 != s2 {
		t.Errorf("Game scores should be equal, right is %d, left is %d.", s1, s2)
	}

	if s1 != 25 {
		t.Errorf("Game scores should 25, but is %d.", s1)
	}

}

func TestGameScore(t *testing.T) {
	g := initSingleGame(InitTournament())
	g.RightPlayerOne.Ranking = 1000
	g.LeftPlayerOne.Ranking = 2000
	s1, s2 := g.GameScore()

	if s1 == s2 {
		t.Errorf("Game scores should be equal, right is %d, left is %d.", s1, s2)
	}

	if s1 != 45 {
		t.Errorf("Game scores should 45, but is %d.", s1)
	}

	if s2 != 5 {
		t.Errorf("Game scores should 5, but is %d.", s2)
	}

}

func TestSetGameScore(t *testing.T) {
	g := initSingleGame(InitTournament())
	g.LeftPlayerOne.Ranking = 900
	g.RightPlayerOne.Ranking = 2200
	g.Winner = RIGHT
	g.UpdateScore()
	if s := g.RightScore; s != 2 {
		t.Errorf("Game scores should be 2, but is %d.", s)
	}
	if s := g.LeftScore; s != -2 {
		t.Errorf("Game scores should be -2, but is %d.", s)
	}
}
