package model

import (
	"testing"
)

func initSingleGame() *Game {
	t := NewTournament("test")
	tt := NewTournamentTable(
		t,
		NewTable("test", Color{
			Right: "green",
			Left:  "blue",
		}),
	)
	g := NewGame(tt)
	g.AddTournamentPlayer(NewTournamentPlayer(NewPlayer("tt", "Thomas", "rfid1"), t))
	g.AddTournamentPlayer(NewTournamentPlayer(NewPlayer("jj", "Jens", "rfid1"), t))
	return g
}

func initDuroGame() *Game {
	t := NewTournament("test")
	tt := NewTournamentTable(
		t,
		NewTable("test", Color{
			Right: "white",
			Left:  "black",
		}),
	)
	g := NewGame(tt)
	g.AddTournamentPlayer(NewTournamentPlayer(NewPlayer("t", "Thomas", "rfid1"), t))
	g.AddTournamentPlayer(NewTournamentPlayer(NewPlayer("j", "Jens", "rfid1"), t))
	g.AddTournamentPlayer(NewTournamentPlayer(NewPlayer("e", "Emilie", "rfid1"), t))
	g.AddTournamentPlayer(NewTournamentPlayer(NewPlayer("k", "Kristine", "rfid1"), t))
	return g
}

func TestCreateSingleGame(t *testing.T) {
	g := initSingleGame()

	if len(g.UUID) != 36 {
		t.Errorf("Player should have UUID, got: %s", g.UUID)
	}

	if g.Right()[0].RealName != "Thomas" {
		t.Errorf("Right player is incorrect, got: %s, want: %s.", g.Right()[0].RealName, "Thomas")
	}

	if g.Left()[0].RealName != "Jens" {
		t.Errorf("Left player is incorrect, got: %s, want: %s.", g.Left()[0].RealName, "Jens")
	}

	if g.TournamentTable.Table.Name != "test" {
		t.Errorf("Table is incorrect, got: %s, want: %s.", g.TournamentTable.Table.Name, "test")
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
	g := initDuroGame()

	if len(g.UUID) != 36 {
		t.Errorf("Player should have UUID, got: %s", g.UUID)
	}

	if g.Right()[1].RealName != "Emilie" {
		t.Errorf("Right player is incorrect, got: %s, want: %s.", g.Right()[1].RealName, "Emilie")
	}

	if g.Left()[1].RealName != "Kristine" {
		t.Errorf("Left player is incorrect, got: %s, want: %s.", g.Left()[1].RealName, "Kristine")
	}

	if g.TournamentTable.Table.Name != "test" {
		t.Errorf("Table is incorrect, got: %s, want: %s.", g.TournamentTable.Table.Name, "test")
	}
}

func TestInitialGameScore(t *testing.T) {
	g := initSingleGame()
	s1, s2 := g.GameScore()

	if s1 != s2 {
		t.Errorf("Game scores should be equal, right is %d, left is %d.", s1, s2)
	}

	if s1 != 25 {
		t.Errorf("Game scores should 25, but is %d.", s1)
	}

}

func TestGameScore(t *testing.T) {
	g := initSingleGame()
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
	g := initSingleGame()
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
