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

	router.GET("/players/:name", resources.GetPlayer(db))
	router.POST("/players/", resources.PostPlayer(db))

	router.Run(":8080")
}
