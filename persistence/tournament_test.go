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

	found, _, err := r.Find(tournament1.UUID)
	if err != nil {
		t.Errorf("Failed to find tournament")
	}

	if len(found.TournamentTables) != 1 {
		t.Errorf("Tournament should have a table, got: %d.", len(found.TournamentTables))
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

	if found.Name != "Foosball tournament 1" {
		t.Errorf("Find should find tournament, got: %s, want: %s.", found.Name, "Foosball tournament 1")
	}

	name := found.TournamentTables[0].Table.Name
	if name != "1" {
		t.Errorf("Tournament should have table with name, got: %s, want: %s.", name, "1")
	}

	if len(found.TournamentPlayers) != 0 {
		t.Errorf("Tournament should have no players, got: %d.", len(found.TournamentPlayers))
	}
}

func TestAddPlayers2Tournament(t *testing.T) {
	table := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	tournament := model.NewTournament("Foosball tournament 1", *table)

	db := InitDB(t)
	defer db.Close()

	r := NewTournamentRepository(db)
	p1 := model.NewPlayer("p1", "n2")
	p2 := model.NewPlayer("p2", "n2")

	tournament.AddPlayer(p1)
	err := r.Store(tournament)
	if err != nil {
		t.Errorf("Failed to store: %s", err.Error())
	}

	tournament, found, err := r.Find(tournament.UUID)
	if !found {
		t.Errorf("Tournament not found")
	}
	if err != nil {
		t.Errorf("Failed to find: %s", err.Error())
	}

	tournament.AddPlayer(p2)
	err = r.Update(tournament)
	if err != nil {
		t.Errorf("Failed to update: %s", err.Error())
	}

	tournament, _, _ = r.Find(tournament.UUID)

	if len(tournament.TournamentPlayers) != 2 {
		t.Errorf("Tournament should have two players, got: %d.", len(tournament.TournamentPlayers))
	}

	randomGames := tournament.RandomGames()
	if len(randomGames) != 1 {
		t.Errorf("Tournament be able to create random game, got: %d.", len(randomGames))
	}

	players := NewPlayerRepository(db).FindByTournament(tournament.UUID)
	if len(players) != 2 {
		t.Errorf("Tournament should have two players, got: %d.", len(players))
	}

	if len(tournament.ActivePlayers()) != 2 {
		t.Errorf("Tournament should have two active players, got: %d.", len(tournament.ActivePlayers()))
	}

	tournament.DeactivatePlayer(p1.Nickname)
	err = r.Update(tournament)
	if err != nil {
		t.Errorf("Failed to update: %s", err.Error())
	}

	tournament, _, _ = r.Find(tournament.UUID)

	if len(tournament.ActivePlayers()) != 1 {
		t.Errorf("Tournament should have one active player, got: %d.", len(tournament.ActivePlayers()))
	}

}
