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

func postPlayers(ts *httptest.Server) func(t *testing.T) []model.Player {
	return func(t *testing.T) []model.Player {

		player1, err := json.Marshal(map[string]string{
			"nickname": "p1",
			"realname": "test1",
			"rfid":     "string",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		player2, err := json.Marshal(map[string]string{
			"nickname": "p2",
			"realname": "test2",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		resp1, _ := http.Post(fmt.Sprintf("%s/players", ts.URL), "application/json", bytes.NewBuffer(player1))

		if resp1.StatusCode != 201 {
			t.Fatalf("Expected status code 201, got %v", resp1.StatusCode)
		}

		resp2, _ := http.Post(fmt.Sprintf("%s/players", ts.URL), "application/json", bytes.NewBuffer(player2))

		if resp2.StatusCode != 201 {
			t.Fatalf("Expected status code 201, got %v", resp2.StatusCode)
		}

		resp, _ := http.Get(fmt.Sprintf("%s/players", ts.URL))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp2.StatusCode)
		}

		result := []model.Player{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected an list of players, got %v", err)
		}

		if len(result) != 2 {
			t.Fatalf("Expected 2 players, got %d", len(result))
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

func addPlayer2Tournaments(ts *httptest.Server, id uint) func(t *testing.T) {
	return func(t *testing.T) {

		player, err := json.Marshal(map[string]interface{}{
			"nickname": "p1",
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

func Test(t *testing.T) {
	ts, _ := startServer()
	defer ts.Close()

	postPlayers(ts)(t)
	tournament := postTournaments(ts)(t)
	addPlayer2Tournaments(ts, tournament.ID)(t)
}
