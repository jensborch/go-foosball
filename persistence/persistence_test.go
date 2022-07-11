package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Errorf("Failed to connect database: %s", err.Error())
	}
	db.AutoMigrate(&model.Tournament{},
		&model.TournamentTable{},
		&model.TournamentPlayer{},
		&model.Table{},
		&model.Player{},
		&model.Game{},
		&model.TournamentPlayerHistory{})
	return db
}
