package main

import (
	"fmt"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	db.AutoMigrate(&model.Tournament{}, &model.TournamentTable{})

	table1 := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	table2 := model.NewTable("2", model.Color{Right: "black", Left: "blue"})
	tournament := model.NewTournament("Foosball tournament 1", []*model.Table{table1, table2})

	db.Create(&tournament)

	tournament2 := db.Where("UUID = ?", tournament.UUID).First(&tournament)

	fmt.Println(tournament2)

	p1 := model.Player{
		PlayerID: "tt",
		RealName: "Thomas",
	}

	p2 := model.Player{
		PlayerID: "jj",
		RealName: "Jens",
	}

	g := model.NewSinglesGame(tournament.TournamentTables[0], &p1, &p2)
	fmt.Println(g)
}
