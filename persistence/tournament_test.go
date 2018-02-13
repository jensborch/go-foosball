package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func TestStoreTournament(t *testing.T) {
	table1 := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	table2 := model.NewTable("2", model.Color{Right: "black", Left: "blue"})
	tournament1 := model.NewTournament("Foosball tournament 1", []*model.Table{table1})
	tournament2 := model.NewTournament("Foosball tournament 2", []*model.Table{table1, table2})

	db, err := gorm.Open("sqlite3", ":memory:")
	if err != nil {
		t.Errorf("Failed to connect database")
	}
	defer db.Close()

	db.AutoMigrate(&model.Tournament{}, &model.TournamentTable{}, &model.Table{})

	r := NewTournamentRepository(db)

	r.Store(tournament1)
	r.Store(tournament2)

	if len(r.FindAll()) != 2 {
		t.Errorf("FindAll should return all tournaments, got: %d, want: %d.", len(r.FindAll()), 2)
	}

	found, _, err := r.Find(tournament1.UUID)
	if err != nil {
		t.Errorf("Failed to find tournament")
	}

	if found.Name != "Foosball tournament 1" {
		t.Errorf("Find should find tournament, got: %s, want: %s.", found.Name, "Foosball tournament 1")
	}

}
