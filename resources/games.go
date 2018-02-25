package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
)

// GetGames find all games in tournament
func GetGames(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		c.JSON(http.StatusOK, persistence.NewGameRepository(db).FindByTournament(id))
	}
}

// GetRandomGames for a tournament
func GetRandomGames(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		if t, found, err := persistence.NewTournamentRepository(db).Find(id); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", id)})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		} else {
			c.JSON(http.StatusOK, t.RandomGames())
			return
		}
	}
}
