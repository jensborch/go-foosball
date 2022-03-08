package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func TestStoreTournament(t *testing.T) {
	tournament1 := model.NewTournament("Foosball tournament 1")

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

	tournament2 := model.NewTournament("Foosball tournament 2")

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
}

func TestAddRemoveTournamentTable(t *testing.T) {
	tournament := model.NewTournament("Foosball tournament 1")

	db := InitDB(t)
	defer db.Close()

	tourRepo := NewTournamentRepository(db)

	tourRepo.Store(tournament)

	tableRepo := NewTableRepository(db)

	table := model.NewTable("Test", model.Color{
		Right: "1",
		Left:  "2",
	})

	tableRepo.Store(table)

	if found, err := tourRepo.AddTables(tournament.UUID, table); err != nil || !found {
		t.Errorf("Failed to store: %s", err.Error())
	}

	if tables, found, err := tourRepo.FindAllTables(tournament.UUID); err != nil || !found {
		t.Errorf("Failed to find tables: %s", err.Error())
		if len(tables) != 1 {
			t.Errorf("Tournament should have one tabel, got %d", len(tables))
		}
	}

	if _, found, err := tourRepo.FindTable(tournament.UUID, table.UUID); err != nil || !found {
		t.Errorf("Failed to find table: %s", err.Error())
	}

	if found, err := tourRepo.RemoveTable(tournament.UUID, table.UUID); err != nil || !found {
		t.Errorf("Failed to find table: %s", err.Error())
	}

	if tables, found, err := tourRepo.FindAllTables(tournament.UUID); err != nil || !found || len(tables) != 0 {
		t.Errorf("Not tables should be found, got %d", len(tables))
	}

}

/*func TestAddPlayers2Tournament(t *testing.T) {
	table := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	tournament := model.NewTournament("Foosball tournament 1")

	db := InitDB(t)
	defer db.Close()

	r := NewTournamentRepository(db)
	p1 := model.NewPlayer("p1", "n2", "rfid")
	p2 := model.NewPlayer("p2", "n2", "rfid")

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

	if l := len(tournament.TournamentPlayers); l != 2 {
		t.Errorf("Tournament should have two players, got: %d.", l)
	}

	if id := tournament.TournamentPlayers[0].Tournament.ID; id == 0 {
		t.Errorf("Players should have tournament with id, got: %d.", id)
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

}*/

/*func TestCalculateGameScore(t *testing.T) {
	table := model.NewTable("1", model.Color{Right: "red", Left: "green"})
	tournament := model.NewTournament("Foosball tournament 1", *table)

	db := InitDB(t)
	defer db.Close()

	r := NewTournamentRepository(db)
	p1 := model.NewPlayer("p1", "n2", "rfid")
	p2 := model.NewPlayer("p2", "n2", "rfid")

	tournament.AddPlayer(p1)
	tournament.AddPlayer(p2)

	r.Store(tournament)
	tournament, _, _ = r.Find(tournament.UUID)

	games := tournament.RandomGames()

	if s := games[0].GetOrCalculateLeftScore(); s != 25 {
		t.Errorf("Games should have score, wanted %d, got: %d.", 25, s)
	}
}*/
