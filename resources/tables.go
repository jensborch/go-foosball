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
