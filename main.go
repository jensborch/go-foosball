package main

import (
	"fmt"

	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	db.AutoMigrate(&model.Tournament{}, &model.TournamentTable{}, &model.Table{}, &model.Player{}, &model.Game{})

	table1 := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	table2 := model.NewTable("2", model.Color{Right: "black", Left: "blue"})
	tournament := model.NewTournament("Foosball tournament 1", []*model.Table{table1, table2})

	db.Create(&tournament)

	fmt.Println(db.Where("UUID = ?", tournament.UUID).First(&tournament))

	p1 := model.NewPlayer("tt", "Thomas")
	db.Delete(&model.Player{
		Nickname: "tt",
	})
	p2 := model.NewPlayer("jj", "Jens")
	db.Delete(&model.Player{
		Nickname: "jj",
	})

	r := persistence.NewPlayerRepository(db)

	r.Store(p1)
	r.Store(p2)

	player, err := r.Find("jj")

	players := r.FindAll()

	fmt.Println(player)
	fmt.Println("===============")
	fmt.Println(players)

	g := model.NewSinglesGame(tournament.TournamentTables[0], p1, p2)
	fmt.Println(g)
}
