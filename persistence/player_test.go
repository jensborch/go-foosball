package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func initTournament() *model.Tournament {
	table1 := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	table2 := model.NewTable("2", model.Color{Right: "black", Left: "blue"})
	return model.NewTournament("test", *table1, *table2)
}

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

	found, _, err := r.Find("jj")
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

func TestUpdatePlayer(t *testing.T) {
	p := model.NewPlayer("tt", "Thomas")
	db := InitDB(t)
	defer db.Close()

	db.AutoMigrate(&model.Player{}, &model.TournamentPlayer{}, &model.Tournament{})

	pr := NewPlayerRepository(db)
	pr.Store(p)

	tr := NewTournamentRepository(db)
	tournament := initTournament()
	tr.Store(tournament)

	p.AddToTournament(*tournament)
	pr.Update(p)

}
