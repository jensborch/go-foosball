package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func TestStorePlayer(t *testing.T) {
	p1 := model.NewPlayer("tt", "Thomas")
	p2 := model.NewPlayer("jj", "Jens")

	db, err := gorm.Open("sqlite3", ":memory:")
	if err != nil {
		t.Errorf("Failed to connect database")
	}
	defer db.Close()

	db.AutoMigrate(&model.Player{})

	r := NewPlayerRepository(db)

	r.Store(p1)
	r.Store(p2)

	if len(r.FindAll()) != 2 {
		t.Errorf("FindAll should return all playes, got: %d, want: %d.", len(r.FindAll()), 2)
	}

	found, err := r.Find("jj")
	if err != nil {
		t.Errorf("Failed to find player")
	}

	if found.Nickname != "jj" {
		t.Errorf("Find should find player, got: %s, want: %s.", found.Nickname, "jj")
	}

	err = r.Remove(p1)
	if err != nil {
		t.Errorf("Failed to remove player")
	}

	if len(r.FindAll()) != 1 {
		t.Errorf("FindAll should return only 1 player afer delete, got: %d", len(r.FindAll()))
	}

}
