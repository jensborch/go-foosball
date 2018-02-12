package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
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

	router.GET("/players/:name", func(c *gin.Context) {
		name := c.Param("name")
		log.Printf("Finding player %s", name)
		r := persistence.NewPlayerRepository(db)
		p, found, err := r.Find(name)
		if found {
			c.JSON(http.StatusOK, p)
		} else if err == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find %s", name)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	})

	router.POST("/players/", func(c *gin.Context) {
		var player model.Player
		if err := c.ShouldBindJSON(&player); err == nil {
			tx := db.Begin()
			r := persistence.NewPlayerRepository(tx)
			r.Store(model.NewPlayer(player.Nickname, player.RealName))
			tx.Commit()
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})

	router.Run(":8080")
}
