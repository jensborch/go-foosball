package resources

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
		r := persistence.NewTournamentRepository(db)
		t, _, _ := r.Find(id)
		//TODO: Error handling
		c.JSON(http.StatusOK, t.RandomGames())
	}
}
