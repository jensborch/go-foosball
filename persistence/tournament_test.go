package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func initTournament(t *testing.T) (model.TournamentRepository, *model.Tournament, *gorm.DB) {
	tournament := model.NewTournament("Foosball tournament 1")
	db := InitDB(t)
	r := NewTournamentRepository(db)

	r.Store(tournament)
	return r, tournament, db
}

func TestStoreTournament(t *testing.T) {
	r, tournament, _ := initTournament(t)

	found, _ := r.Find(tournament.IdAsString())

	tournament2 := model.NewTournament("Foosball tournament 2")

	r.Store(tournament2)

	if len(r.FindAll()) != 2 {
		t.Errorf("FindAll should return all tournaments, got: %d, want: %d.", len(r.FindAll()), 2)
	}

	if found.Name != "Foosball tournament 1" {
		t.Errorf("Find should find tournament, got: %s, want: %s.", found.Name, "Foosball tournament 1")
	}
}

func TestAddRemoveTournamentTable(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)

	tableRepo := NewTableRepository(db)

	table := model.NewTable("Test", model.Color{
		Right: "1",
		Left:  "2",
	})

	tableRepo.Store(table)

	if _, found := tourRepo.AddTables(tournament.IdAsString(), table); !found {
		t.Errorf("Failed to store, not found")
	}

	if tables, found := tourRepo.FindAllTables(tournament.IdAsString()); !found {
		t.Errorf("Failed to find tables")
		if len(tables) != 1 {
			t.Errorf("Tournament should have one tabel, got %d", len(tables))
		}
	}

	if _, found := tourRepo.FindTable(tournament.IdAsString(), table.IdAsString()); !found {
		t.Errorf("Failed to find table")
	}

	if found := tourRepo.RemoveTable(tournament.IdAsString(), table.IdAsString()); !found {
		t.Errorf("Failed to find table")
	}

	if tables, _ := tourRepo.FindAllTables(tournament.IdAsString()); len(tables) != 0 {
		t.Errorf("Tables should not be found, got %d", len(tables))
	}

}

func TestTournamentPlayerNotFound(t *testing.T) {
	tourRepo, _, _ := initTournament(t)
	if _, found := tourRepo.FindPlayer("42", "test"); found {
		t.Errorf("No player should be found, got %t", found)
	}

}

func TestAddRemoveTournamentPlayer(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)

	playerRepo := NewPlayerRepository(db)

	player1 := model.NewPlayer("test1", "test", "")
	player2 := model.NewPlayer("test2", "test", "")

	playerRepo.Store(player1)
	playerRepo.Store(player2)

	tourRepo.AddPlayer(tournament.IdAsString(), player1)
	tourRepo.AddPlayerWithRanking(tournament.IdAsString(), player2, 2000)

	if players, found := tourRepo.FindAllActivePlayers(tournament.IdAsString()); !found {
		t.Errorf("Failed to find players, got %t", found)
		if len(players) != 2 {
			t.Errorf("Tournament should have two player, got %d", len(players))
		}
	}

	if player, found := tourRepo.FindPlayer(tournament.IdAsString(), player1.Nickname); !found {
		t.Errorf("Failed to find player 1, got %t", found)
	} else if player.Ranking != 1500 {
		t.Errorf("Player 1 should have rating 1500, got %d", player.Ranking)
	}

	if player, found := tourRepo.FindPlayer(tournament.IdAsString(), player2.Nickname); !found {
		t.Errorf("Failed to find player 2, got %t", found)
	} else if player.Ranking != 2000 {
		t.Errorf("Player 2 should have rating 2000, got %d", player.Ranking)
	}
}

func TestRandomGame(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)

	playerRepo := NewPlayerRepository(db)

	player1 := model.NewPlayer("test1", "test", "")
	player2 := model.NewPlayer("test2", "test", "")
	player3 := model.NewPlayer("test3", "test", "")
	player4 := model.NewPlayer("test4", "test", "")

	playerRepo.Store(player1)
	playerRepo.Store(player2)
	playerRepo.Store(player3)
	playerRepo.Store(player4)

	tourRepo.AddPlayerWithRanking(tournament.IdAsString(), player1, 2500)
	tourRepo.AddPlayerWithRanking(tournament.IdAsString(), player2, 2000)
	tourRepo.AddPlayer(tournament.IdAsString(), player3)
	tourRepo.AddPlayer(tournament.IdAsString(), player4)

	tableRepo := NewTableRepository(db)
	table := model.NewTable("New1", model.Color{
		Right: "1",
		Left:  "2",
	})
	tableRepo.Store(table)

	tourRepo.AddTables(tournament.IdAsString(), table)

	if games, found := tourRepo.RandomGames(tournament.IdAsString()); !found {
		t.Errorf("Failed to generate random games, got %t", found)
	} else if len(games) != 1 {
		t.Errorf("Should genrate 1 random games, got %d", len(games))
	}
}

func TestSaveGame(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)

	playerRepo := NewPlayerRepository(db)

	player1 := model.NewPlayer("test1", "test", "")
	player2 := model.NewPlayer("test2", "test", "")

	playerRepo.Store(player1)
	playerRepo.Store(player2)

	tourRepo.AddPlayer(tournament.IdAsString(), player1)
	tourRepo.AddPlayer(tournament.IdAsString(), player2)

	tableRepo := NewTableRepository(db)
	table := model.NewTable("New2", model.Color{
		Right: "1",
		Left:  "2",
	})
	tableRepo.Store(table)

	tourRepo.AddTables(tournament.IdAsString(), table)
	tt, _ := tourRepo.FindTable(tournament.IdAsString(), table.IdAsString())

	gameRepo := NewGameRepository(db)
	game := model.NewGame(tt)
	//TODO
	//game.AddTournamentPlayer(player1)
	gameRepo.Store(game)

}

func TestActivatePlayer(t *testing.T) {
	tourRepo, tournament, db := initTournament(t)

	playerRepo := NewPlayerRepository(db)

	player1 := model.NewPlayer("test1", "test", "")
	player2 := model.NewPlayer("test2", "test", "")

	playerRepo.Store(player1)
	playerRepo.Store(player2)

	tourRepo.AddPlayer(tournament.IdAsString(), player1)
	tourRepo.AddPlayer(tournament.IdAsString(), player2)

	if _, found := tourRepo.DeactivatePlayer(tournament.IdAsString(), player1.Nickname); !found {
		t.Errorf("Failed deactivate player 1, not found")
	}

	if players, found := tourRepo.FindAllActivePlayers(tournament.IdAsString()); !found {
		t.Errorf("Failed to find players, got %t", found)
		if len(players) != 1 {
			t.Errorf("Tournament should have one active player, got %d", len(players))
		}
	}

	if player, _ := tourRepo.FindPlayer(tournament.IdAsString(), player1.Nickname); player.Active {
		t.Errorf("Deactivated player should not be active")
	}

	if _, found := tourRepo.ActivatePlayer(tournament.IdAsString(), player1.Nickname); !found {
		t.Errorf("Failed activate player 1, got %t", found)
	}

	if players, found := tourRepo.FindAllActivePlayers(tournament.IdAsString()); !found {
		t.Errorf("Failed to find players, got %t", found)
		if len(players) != 2 {
			t.Errorf("Tournament should have two active players, got %d", len(players))
		}
	}

	if player, _ := tourRepo.FindPlayer(tournament.IdAsString(), player1.Nickname); !player.Active {
		t.Errorf("Activated player should be active")
	}
}
