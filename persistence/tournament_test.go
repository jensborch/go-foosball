package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func initTournament(t *testing.T) (model.TournamentRepository, *model.Tournament, *gorm.DB) {
	tournament := model.NewTournament("Foosball tournament 1")
	db := InitDB(t)
	r := NewTournamentRepository(db)

	err := r.Store(tournament)
	if err != nil {
		t.Errorf("Failed to store: %s", err.Error())
	}
	return r, tournament, db
}

func TestStoreTournament(t *testing.T) {
	r, tournament, db := initTournament(t)
	defer db.Close()

	found, _, err := r.Find(tournament.UUID)
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
	tourRepo, tournament, db := initTournament(t)
	defer db.Close()

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

func TestAddRemoveTournamentPlayer(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)
	defer db.Close()

	playerRepo := NewPlayerRepository(db)

	player1 := model.NewPlayer("test1", "test", "")
	player2 := model.NewPlayer("test2", "test", "")

	playerRepo.Store(player1)
	playerRepo.Store(player2)

	tourRepo.AddPlayer(tournament.UUID, player1)
	tourRepo.AddPlayerWithRanking(tournament.UUID, player2, 2000)

	if players, found, err := tourRepo.FindAllActivePlayers(tournament.UUID); err != nil || !found {
		t.Errorf("Failed to find players: %s", err.Error())
		if len(players) != 2 {
			t.Errorf("Tournament should have two player, got %d", len(players))
		}
	}

	if player, found, err := tourRepo.FindPlayer(tournament.UUID, player1.Nickname); err != nil || !found {
		t.Errorf("Failed to find player 1 %s", err.Error())
	} else if player.Ranking != 1500 {
		t.Errorf("Player 1 should have rating 1500, got %d", player.Ranking)
	}

	if player, found, err := tourRepo.FindPlayer(tournament.UUID, player2.Nickname); err != nil || !found {
		t.Errorf("Failed to find player 2 %s", err.Error())
	} else if player.Ranking != 2000 {
		t.Errorf("Player 2 should have rating 2000, got %d", player.Ranking)
	}
}

func TestRandomGame(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)
	defer db.Close()

	playerRepo := NewPlayerRepository(db)

	player1 := model.NewPlayer("test1", "test", "")
	player2 := model.NewPlayer("test2", "test", "")
	player3 := model.NewPlayer("test3", "test", "")
	player4 := model.NewPlayer("test4", "test", "")

	playerRepo.Store(player1)
	playerRepo.Store(player2)
	playerRepo.Store(player3)
	playerRepo.Store(player4)

	tourRepo.AddPlayerWithRanking(tournament.UUID, player1, 2500)
	tourRepo.AddPlayerWithRanking(tournament.UUID, player2, 2000)
	tourRepo.AddPlayer(tournament.UUID, player3)
	tourRepo.AddPlayer(tournament.UUID, player4)

	tableRepo := NewTableRepository(db)
	table := model.NewTable("Test", model.Color{
		Right: "1",
		Left:  "2",
	})
	tableRepo.Store(table)

	tourRepo.AddTables(tournament.UUID, table)

	if games, found, err := tourRepo.RandomGames(tournament.UUID); err != nil || !found {
		t.Errorf("Failed to generate random games %s", err.Error())
	} else if len(games) == 1 {
		t.Errorf("Should genrate 1 random games, got %d", len(games))
	}
}

func TestActivatePlayer(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)
	defer db.Close()

	playerRepo := NewPlayerRepository(db)

	player1 := model.NewPlayer("test1", "test", "")
	player2 := model.NewPlayer("test2", "test", "")

	playerRepo.Store(player1)
	playerRepo.Store(player2)

	tourRepo.AddPlayer(tournament.UUID, player1)
	tourRepo.AddPlayer(tournament.UUID, player2)

	if found, err := tourRepo.DeactivatePlayer(tournament.UUID, player1.Nickname); err != nil || !found {
		t.Errorf("Failed deactivate player 1: %s", err.Error())
	}

	if players, found, err := tourRepo.FindAllActivePlayers(tournament.UUID); err != nil || !found {
		t.Errorf("Failed to find players: %s", err.Error())
		if len(players) != 1 {
			t.Errorf("Tournament should have one active player, got %d", len(players))
		}
	}

	if player, _, _ := tourRepo.FindPlayer(tournament.UUID, player1.Nickname); player.Active {
		t.Errorf("Deactivated player should not be active")
	}

	if found, err := tourRepo.ActivatePlayer(tournament.UUID, player1.Nickname); err != nil || !found {
		t.Errorf("Failed activate player 1: %s", err.Error())
	}

	if players, found, err := tourRepo.FindAllActivePlayers(tournament.UUID); err != nil || !found {
		t.Errorf("Failed to find players: %s", err.Error())
		if len(players) != 2 {
			t.Errorf("Tournament should have two active players, got %d", len(players))
		}
	}

	if player, _, _ := tourRepo.FindPlayer(tournament.UUID, player1.Nickname); !player.Active {
		t.Errorf("Activated player should be active")
	}
}
