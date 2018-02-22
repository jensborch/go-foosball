package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func TestStoreTournament(t *testing.T) {
	table1 := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	tournament1 := model.NewTournament("Foosball tournament 1", *table1)

	db := InitDB(t)
	defer db.Close()

	r := NewTournamentRepository(db)

	err := r.Store(tournament1)
	if err != nil {
		t.Errorf("Failed to store: %s", err.Error())
	}

	table2 := model.NewTable("2", model.Color{Right: "black", Left: "blue"})
	tournament2 := model.NewTournament("Foosball tournament 2", tournament1.TournamentTables[0].Table, *table2)

	err = r.Store(tournament2)
	if err != nil {
		t.Errorf("Failed to store: %s", err.Error())
	}

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

	if len(found.TournamentTables) != 1 {
		t.Errorf("Tournament should have a table, got: %d.", len(found.TournamentTables))
	}

	name := found.TournamentTables[0].Table.Name
	if name != "1" {
		t.Errorf("Tournament should have table with name, got: %s, want: %s.", name, "1")
	}

	if len(found.TournamentPlayers) != 0 {
		t.Errorf("Tournament should have no players, got: %d.", len(found.TournamentPlayers))
	}

}
