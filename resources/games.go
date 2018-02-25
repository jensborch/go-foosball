package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
)

// GetGames find all games in tournament
func GetGames(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewGameRepository(db)
		t := r.FindByTournament(id)
		c.JSON(http.StatusOK, t)
	}
}

// GetRandomGames for a tournament
func GetRandomGames(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var (
			t     *model.Tournament
			found model.Found
		)
		if t, found, _ = persistence.NewTournamentRepository(db).Find(id); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", t.Name)})
			return
		}
		c.JSON(http.StatusOK, t.RandomGames())
	}
}
