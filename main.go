package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/resources"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	router := gin.Default()

	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	db.AutoMigrate(&model.Tournament{}, &model.TournamentTable{}, &model.Table{}, &model.Player{}, &model.Game{})

	router.POST("/players/", resources.PostPlayer(db))
	router.GET("/players/:name", resources.GetPlayer("name", db))
	router.GET("/players/", resources.GetPlayers(db))

	router.POST("/tournaments/", resources.PostTournament(db))
	router.GET("/tournaments/", resources.GetTournaments(db))
	router.GET("/tournaments/:id", resources.GetTournament("id", db))
	router.GET("/tournaments/:id/players", resources.GetTournamentPlayes("id", db))
	router.POST("/tournaments/:id/players", resources.PostTournamentPlayer("id", db))

	router.StaticFile("/", "./src/github.com/jensborch/go-foosball/index.html")

	router.GET("/tournaments/:id/events", resources.GetTournamentEvents("id"))

	router.Run(":8080")
}
