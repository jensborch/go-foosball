package main

import (
	"fmt"

	"github.com/jensborch/go-foosball/model"
)

func main() {
	table1 := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	table2 := model.NewTable("2", model.Color{Right: "black", Left: "blue"})
	tournament := model.NewTournament("Foosball tournament 1", []*model.Table{table1, table2})
	fmt.Println(tournament)

	p1 := model.Player{
		PlayerID: "tt",
		RealName: "Thomas",
	}

	p2 := model.Player{
		PlayerID: "jj",
		RealName: "Jens",
	}

	g := model.NewSinglesGame(tournament.Tables[0], &p1, &p2)
	fmt.Println(g)
}
