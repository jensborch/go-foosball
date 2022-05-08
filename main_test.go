package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/resources"
	"gorm.io/gorm"
)

func startServer() (*httptest.Server, *gorm.DB) {
	if err := os.Remove("test.db"); err != nil {
		fmt.Println("Could not delete test DB", err)
	}
	engine, db := setupServer("test.db")
	return httptest.NewServer(engine), db
}

func TestGetEmptyList(t *testing.T) {
	ts, _ := startServer()
	defer ts.Close()

	cases := []struct{ url string }{
		{fmt.Sprintf("%s/players", ts.URL)},
		{fmt.Sprintf("%s/tournaments", ts.URL)},
		{fmt.Sprintf("%s/tables", ts.URL)},
		{fmt.Sprintf("%s/games", ts.URL)},
	}

	for _, c := range cases {

		resp, err := http.Get(c.url)

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}

		result := []interface{}{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected an array, got %v", err)
		}

		if len(result) != 0 {
			t.Fatalf("Expected empty array, got %d", len(result))
		}
	}
}

func TestGetNotFound(t *testing.T) {
	ts, _ := startServer()
	defer ts.Close()

	cases := []struct{ url string }{
		{fmt.Sprintf("%s/players/404", ts.URL)},
		{fmt.Sprintf("%s/tournaments/404", ts.URL)},
		{fmt.Sprintf("%s/tables/404", ts.URL)},
		{fmt.Sprintf("%s/games/404", ts.URL)},
	}

	for _, c := range cases {

		resp, err := http.Get(c.url)

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if resp.StatusCode != 404 {
			t.Fatalf("Expected status code 404, got %v", resp.StatusCode)
		}

		result := resources.ErrorResponse{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected an error response, got %v", err)
		}

		if len(result.Error) == 0 {
			t.Fatalf("Expected error msg, got empty string")
		}
	}
}

func newPlayer(nickname string, realname string) func(t *testing.T) []byte {
	return func(t *testing.T) []byte {
		player, err := json.Marshal(map[string]string{
			"nickname": nickname,
			"realname": realname,
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		return player
	}
}

func postPlayers(ts *httptest.Server) func(t *testing.T) []model.Player {
	return func(t *testing.T) []model.Player {

		players := []struct{ player []byte }{
			{newPlayer("p1", "n1")(t)},
			{newPlayer("p2", "n2")(t)},
		}

		for _, p := range players {

			resp, _ := http.Post(fmt.Sprintf("%s/players", ts.URL), "application/json", bytes.NewBuffer(p.player))

			if resp.StatusCode != 201 {
				t.Fatalf("Expected status code 201, got %v", resp.StatusCode)
			}
		}

		resp, _ := http.Get(fmt.Sprintf("%s/players", ts.URL))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}

		result := []model.Player{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected an list of players, got %v", err)
		}

		if len(result) != len(players) {
			t.Fatalf("Expected %d players, got %d", len(players), len(result))
		}

		return result
	}
}

func postTournaments(ts *httptest.Server) func(t *testing.T) model.Tournament {
	return func(t *testing.T) model.Tournament {

		tournament, err := json.Marshal(map[string]interface{}{
			"initial": 1500,
			"name":    "test",
			"score":   50,
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		postResp, _ := http.Post(fmt.Sprintf("%s/tournaments", ts.URL), "application/json", bytes.NewBuffer(tournament))

		if postResp.StatusCode != 201 {
			t.Fatalf("Expected status code 201, got %v", postResp.StatusCode)
		}

		postResult := model.Tournament{}

		if err := json.NewDecoder(postResp.Body).Decode(&postResult); err != nil {
			t.Fatalf("Expected a tournament, got %v", err)
		}

		getResp, _ := http.Get(fmt.Sprintf("%s/tournaments/%d", ts.URL, postResult.ID))

		if getResp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", getResp.StatusCode)
		}

		return postResult
	}
}

func addPlayer2Tournament(ts *httptest.Server, id uint, player string) func(t *testing.T) {
	return func(t *testing.T) {

		player, err := json.Marshal(map[string]interface{}{
			"nickname": player,
			"ranking":  1500,
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		resp, _ := http.Post(fmt.Sprintf("%s/tournaments/%d/players", ts.URL, id), "application/json", bytes.NewBuffer(player))

		if resp.StatusCode != 201 {
			t.Fatalf("Expected status code 201, got %v", resp.StatusCode)
		}
	}
}

func newTable(name string, left string, right string) func(t *testing.T) []byte {
	return func(t *testing.T) []byte {
		table, err := json.Marshal(resources.CreateTableRepresentation{
			Name: name,
			Color: model.Color{
				Left:  left,
				Right: right,
			},
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		return table
	}
}

func postTables(ts *httptest.Server) func(t *testing.T) []model.Table {
	return func(t *testing.T) []model.Table {

		tables := []struct{ table []byte }{
			{newTable("t1", "black", "white")(t)},
			{newTable("t2", "green", "blue")(t)},
		}

		for _, p := range tables {

			resp, _ := http.Post(fmt.Sprintf("%s/tables", ts.URL), "application/json", bytes.NewBuffer(p.table))

			if resp.StatusCode != 201 {
				t.Fatalf("Expected status code 201, got %v", resp.StatusCode)
			}
		}

		resp, _ := http.Get(fmt.Sprintf("%s/tables", ts.URL))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}

		result := []model.Table{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected an list of tables, got %v", err)
		}

		if len(result) != len(tables) {
			t.Fatalf("Expected %d tables, got %d", len(tables), len(result))
		}

		return result
	}
}

func addTable2Tournament(ts *httptest.Server, id uint, table uint) func(t *testing.T) {
	return func(t *testing.T) {

		table, err := json.Marshal(map[string]interface{}{
			"id": table,
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		resp, _ := http.Post(fmt.Sprintf("%s/tournaments/%d/tables", ts.URL, id), "application/json", bytes.NewBuffer(table))

		if resp.StatusCode != 201 {
			t.Fatalf("Expected status code 201, got %v", resp.StatusCode)
		}
	}
}

func Test(t *testing.T) {
	ts, _ := startServer()
	defer ts.Close()

	players := postPlayers(ts)(t)
	tournament := postTournaments(ts)(t)

	for _, p := range players {
		addPlayer2Tournament(ts, tournament.ID, p.Nickname)(t)
	}

	tables := postTables(ts)(t)

	for _, table := range tables {
		addTable2Tournament(ts, tournament.ID, table.ID)(t)
	}

}
