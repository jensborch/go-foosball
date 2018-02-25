package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
)

// GetTable get info about a tables
func GetTable(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		r := persistence.NewTableRepository(db)
		t, found, err := r.Find(id)
		if found {
			c.JSON(http.StatusOK, t)
		} else if err == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find %s", id)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	}
}

// GetTables get list of all tables
func GetTables(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		r := persistence.NewTableRepository(db)
		tables := r.FindAll()
		c.JSON(http.StatusOK, tables)
	}
}

// PostTable creats new table
func PostTable(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var table model.Table
		if err := c.ShouldBindJSON(&table); err == nil {
			tx := db.Begin()
			r := persistence.NewTableRepository(tx)
			t := model.NewTable(table.Name, table.Color)
			r.Store(t)
			tx.Commit()
			c.JSON(http.StatusOK, t)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	}
}

// GetTournamentTables list tables in a tournament
func GetTournamentTables(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var (
			err   error
			found model.Found
			t     *model.Tournament
		)
		tournamentRepo := persistence.NewTournamentRepository(db)
		if t, found, err = tournamentRepo.Find(id); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", t.Name)})
			return
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, t.TournamentTables)
	}
}

// TableRepresentation JSON representation for adding table to tournament
type TableRepresentation struct {
	UUID string `json:"uuid" binding:"required"`
}

// PostTournamentTables adds a table to a tournament
func PostTournamentTables(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var (
			representation TableRepresentation
			table          *model.Table
			tournament     *model.Tournament
			found          model.Found
			err            error
		)
		if err = c.ShouldBindJSON(&representation); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tx := db.Begin()
		r := persistence.NewTournamentRepository(tx)
		if tournament, found, err = r.Find(id); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find tournament %s", tournament.Name)})
			tx.Rollback()
			return
		}
		if table, found, err = persistence.NewTableRepository(tx).Find(representation.UUID); !found {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not find table %s", representation.UUID)})
			tx.Rollback()
			return
		}
		tournament.AddTables(*table)
		if err = r.Update(tournament); err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Could not add table to tournament %s", tournament.UUID)})
			tx.Rollback()
			return
		}
		tx.Commit()
		for _, t := range tournament.TournamentTables {
			if t.Table.UUID == table.UUID {
				c.JSON(http.StatusOK, t)
				return
			}
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Could not find table %s in tournament %s", table.UUID, tournament.UUID)})
	}
}

// DeleteTournamentTable deletes a table from a tournament
func DeleteTournamentTable(tournamentParam string, tableParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		//TODO
	}
}
