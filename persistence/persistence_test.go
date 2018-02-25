package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func InitDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open("sqlite3", ":memory:")
	if err != nil {
		t.Errorf("Failed to connect database: %s", err.Error())
	}
	db.AutoMigrate(&model.Tournament{},
		&model.TournamentTable{},
		&model.TournamentPlayer{},
		&model.Table{},
		&model.Player{},
		&model.Game{})
	return db
}
