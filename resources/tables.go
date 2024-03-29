package resources

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"gorm.io/gorm"
)

// GetTable get info about a table
// @Summary  Get table
// @Tags     table
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Table ID"
// @Success  200  {object}  model.Table
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tables/{id} [get]
func GetTable(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		if t, found := persistence.NewTableRepository(db).Find(id); found {
			c.JSON(http.StatusOK, t)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find %s", id)))
		}
	}
}

// GetTables get list of all tables
// @Summary  Get all tables
// @Tags     table
// @Accept   json
// @Produce  json
// @Param    exclude  query    int  false  "exlude tournament from list"
// @Success  200  {array}  model.Table
// @Router   /tables [get]
func GetTables(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		r := persistence.NewTableRepository(db)
		if exclude, found := c.GetQuery("exclude"); found {
			c.JSON(http.StatusOK, r.FindAllNotInTournament(exclude))
		} else {
			c.JSON(http.StatusOK, r.FindAll())
		}
	}
}

type CreateTableRequest struct {
	Name  string      `json:"name" binding:"required"`
	Color model.Color `json:"color" binding:"required"`
} //@name CreateTable

// PostTable creats new table
// @Summary  Create table
// @Tags     table
// @Accept   json
// @Produce  json
// @Param    table  body      CreateTableRequest  true  "The table"
// @Success  200    {object}  model.Table
// @Failure  400    {object}  ErrorResponse
// @Failure  404    {object}  ErrorResponse
// @Failure  500    {object}  ErrorResponse
// @Router   /tables/ [post]
func PostTable(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var table CreateTableRequest
		if err := c.ShouldBindJSON(&table); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		t := model.NewTable(table.Name, table.Color)
		persistence.NewTableRepository(tx).Store(t)
		c.JSON(http.StatusOK, t)
	}
}

// GetTournamentTables list tables in a tournament
// @Summary  Get tables in a tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id   path      string  true  "Tournament ID"
// @Success  200  {array}   model.TournamentTable
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/tables [get]
func GetTournamentTables(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		defer HandlePanic(c)
		id := c.Param(param)
		tournamentRepo := persistence.NewTournamentRepository(db)
		if tables, found := tournamentRepo.FindAllTables(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
		} else {
			c.JSON(http.StatusOK, tables)
		}
	}
}

type AddTableRequest struct {
	ID uint `json:"id" binding:"required"`
} //@name AddTable

// PostTournamentTables adds a table to a tournament
// @Summary  Add table to tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id     path      string           true  "Tournament ID"
// @Param    table  body      AddTableRequest  true  "The table"
// @Success  201    {object}  model.TournamentTable
// @Failure  400    {object}  ErrorResponse
// @Failure  404    {object}  ErrorResponse
// @Failure  500    {object}  ErrorResponse
// @Router   /tournaments/{id}/tables [post]
func PostTournamentTables(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		var representation AddTableRequest
		if err := c.ShouldBindJSON(&representation); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewTournamentRepository(tx)
		if table, found := persistence.NewTableRepository(tx).Find(strconv.FormatUint(uint64(representation.ID), 10)); found {
			if _, found := r.AddTables(id, table); found {
				c.JSON(http.StatusOK, table)
				return
			}
		}
		c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
	}
}

// DeleteTournamentTable deletes a table from a tournament
// @Summary  Remove table from tournament
// @Tags     tournament
// @Accept   json
// @Produce  json
// @Param    id       path  string  true  "Tournament ID"
// @Param    tableId  path  string  true  "Table ID"
// @Success  204
// @Failure  404  {object}  ErrorResponse
// @Failure  500  {object}  ErrorResponse
// @Router   /tournaments/{id}/tables/{tableId} [delete]
func DeleteTournamentTable(tournamentParam string, tableParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		tourId := c.Param(tournamentParam)
		tableId := c.Param(tableParam)
		tx := db.Begin()
		defer HandlePanicInTransaction(c, tx)
		r := persistence.NewTournamentRepository(tx)
		if found := r.RemoveTable(tourId, tableId); found {
			c.Status(http.StatusNoContent)
		} else {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s or table %s", tourId, tableId)))
		}
	}
}
