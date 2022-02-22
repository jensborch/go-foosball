package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/persistence"
	"github.com/jinzhu/gorm"
)

// GetTable get info about a table
// @Summary      Get table
// @Tags         table
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Table ID"
// @Success      200      {object}  model.Table
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tables/{id} [get]
func GetTable(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		defer HandlePanic(c)
		if t, found, err := persistence.NewTableRepository(db).Find(id); err == nil {
			if found {
				c.JSON(http.StatusOK, t)
			} else {
				c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find %s", id)))
			}
		} else {
			panic(err)
		}
	}
}

// GetTables get list of all tables
// @Summary      Get all tables
// @Tags         table
// @Accept       json
// @Produce      json
// @Success      200      {array}  model.Table
// @Router       /tables [get]
func GetTables(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, persistence.NewTableRepository(db).FindAll())
	}
}

type CreateTableRepresentation struct {
	Name  string      `json:"name"`
	Color model.Color `json:"color"`
}

// PostTable creats new table
// @Summary      Create table
// @Tags         table
// @Accept       json
// @Produce      json
// @Param        table    body      CreateTableRepresentation true  "The table"
// @Success      200      {object}  model.Table
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tables/ [post]
func PostTable(db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		var table CreateTableRepresentation
		if err := c.ShouldBindWith(&table, binding.JSON); err == nil {
			tx := db.Begin()
			t := model.NewTable(table.Name, table.Color)
			if err := persistence.NewTableRepository(tx).Store(t); err == nil {
				tx.Commit()
				c.JSON(http.StatusOK, t)
			} else {
				c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
				tx.Rollback()
			}
		} else {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		}
	}
}

// GetTournamentTables list tables in a tournament
// @Summary      Get tables in a tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Success      200      {array}   model.TournamentTable
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/tables [get]
func GetTournamentTables(param string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		id := c.Param(param)
		tournamentRepo := persistence.NewTournamentRepository(db)
		if t, found, err := tournamentRepo.Find(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", id)))
			return
		} else if err == nil {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			return
		} else {
			c.JSON(http.StatusOK, t.TournamentTables)
			return
		}
	}
}

// TableRepresentation JSON representation for adding table to tournament
type TableRepresentation struct {
	UUID string `json:"uuid" binding:"required"`
}

// PostTournamentTables adds a table to a tournament
// @Summary      Add table to tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Param        table    body      TableRepresentation true "The table"
// @Success      200      {object}  model.TournamentTable
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/tables [post]
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
		if err = c.ShouldBindWith(&representation, binding.JSON); err != nil {
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
			return
		}
		tx := db.Begin()
		r := persistence.NewTournamentRepository(tx)
		if tournament, found, err = r.Find(id); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", tournament.Name)))
			tx.Rollback()
			return
		}
		if table, found, err = persistence.NewTableRepository(tx).Find(representation.UUID); !found {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find table %s", representation.UUID)))
			tx.Rollback()
			return
		}
		tournament.AddTables(*table)
		if err = r.Update(tournament); err != nil {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not add table to tournament %s", tournament.UUID)))
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
		c.JSON(http.StatusInternalServerError, NewErrorResponse(fmt.Sprintf("Could not find table %s in tournament %s", table.UUID, tournament.UUID)))
	}
}

// DeleteTournamentTable deletes a table from a tournament
// @Summary      Remove table from tournament
// @Tags         tournament
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Tournament ID"
// @Param        tableId  path      string  true  "Table ID"
// @Success      204
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /tournaments/{id}/tables/{tableId} [delete]
func DeleteTournamentTable(tournamentParam string, tableParam string, db *gorm.DB) func(*gin.Context) {
	return func(c *gin.Context) {
		tourId := c.Param(tournamentParam)
		r := persistence.NewTournamentRepository(db)
		if t, found, err := r.Find(tourId); found {
			tableId := c.Param(tableParam)
			if err := r.RemoveTable(t, tableId); err != nil {
				c.Status(http.StatusNoContent)
			} else {
				c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			}
			return
		} else if err == nil {
			c.JSON(http.StatusNotFound, NewErrorResponse(fmt.Sprintf("Could not find tournament %s", tourId)))
			return
		} else {
			c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			return
		}
	}
}
