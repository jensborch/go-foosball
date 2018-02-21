package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
)

// GetPlayer gets player info
func GetPlayer(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		name := c.Param(param)
		r := persistence.NewPlayerRepository(db)
		p, found, err := r.Find(name)
		if found {
			c.JSON(http.StatusOK, p)
		} else if err == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find %s", name)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	}
}

// GetPlayers get a list of all players
func GetPlayers(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		r := persistence.NewPlayerRepository(db)
		players := r.FindAll()
		c.JSON(http.StatusOK, players)
	}
}

// PostPlayer creates a new player
func PostPlayer(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var player model.Player
		if err := c.ShouldBindJSON(&player); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tx := db.Begin()
		r := persistence.NewPlayerRepository(tx)
		if _, found, _ := r.Find(player.Nickname); found {
			c.JSON(http.StatusConflict, gin.H{"error": fmt.Sprintf("Player %s already exists", player.Nickname)})
			tx.Rollback()
			return
		}
		p := model.NewPlayer(player.Nickname, player.RealName)
		if err := r.Store(p); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			tx.Rollback()
			return
		}
		c.JSON(http.StatusOK, p)
		tx.Commit()
	}
}
