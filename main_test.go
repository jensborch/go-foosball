package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/resources"
	"gorm.io/gorm"
)

func startServer() (*httptest.Server, *gorm.DB) {
	if err := os.Remove("test.db"); err != nil {
		fmt.Println("Could not delete test DB", err)
	}
	engine, db := setupServer("test.db", true)
	return httptest.NewServer(engine), db
}

func TestGetEmptyList(t *testing.T) {
	ts, _ := startServer()
	defer ts.Close()

	cases := []struct{ url string }{
		{fmt.Sprintf("%s/api/players", ts.URL)},
		{fmt.Sprintf("%s/api/tournaments", ts.URL)},
		{fmt.Sprintf("%s/api/tables", ts.URL)},
		{fmt.Sprintf("%s/api/games", ts.URL)},
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
		{fmt.Sprintf("%s/api/players/404", ts.URL)},
		{fmt.Sprintf("%s/api/tournaments/404", ts.URL)},
		{fmt.Sprintf("%s/api/tables/404", ts.URL)},
		{fmt.Sprintf("%s/api/games/404", ts.URL)},
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

func TestPostPlayerNotValid(t *testing.T) {
	ts, _ := startServer()
	defer ts.Close()

	player := newPlayer("p", "name")(t)

	resp, _ := http.Post(fmt.Sprintf("%s/api/players", ts.URL), "application/json", bytes.NewBuffer(player))

	if resp.StatusCode != 400 {
		t.Fatalf("Expected status code 400, got %v", resp.StatusCode)
	}
}

func postPlayers(ts *httptest.Server) func(t *testing.T) []model.Player {
	return func(t *testing.T) []model.Player {

		players := []struct{ player []byte }{
			{newPlayer("thomas", "Thomas")(t)},
			{newPlayer("kristine", "Kristine")(t)},
			{newPlayer("jens", "Jens")(t)},
		}

		for _, p := range players {

			resp, _ := http.Post(fmt.Sprintf("%s/api/players", ts.URL), "application/json", bytes.NewBuffer(p.player))

			if resp.StatusCode != 200 {
				t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
			}
		}

		resp, _ := http.Get(fmt.Sprintf("%s/api/players", ts.URL))

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
			"name":    "MyTournament",
			"score":   50,
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		postResp, _ := http.Post(fmt.Sprintf("%s/api/tournaments", ts.URL), "application/json", bytes.NewBuffer(tournament))

		if postResp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", postResp.StatusCode)
		}

		postResult := model.Tournament{}

		if err := json.NewDecoder(postResp.Body).Decode(&postResult); err != nil {
			t.Fatalf("Expected a tournament, got %v", err)
		}

		getResp, _ := http.Get(fmt.Sprintf("%s/api/tournaments/%d", ts.URL, postResult.ID))

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

		resp, _ := http.Post(fmt.Sprintf("%s/api/tournaments/%d/players", ts.URL, id), "application/json", bytes.NewBuffer(player))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}
	}
}

func newTable(name string, left string, right string) func(t *testing.T) []byte {
	return func(t *testing.T) []byte {
		table, err := json.Marshal(resources.CreateTableRequest{
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
			{newTable("Table1", "black", "white")(t)},
			{newTable("Table2", "green", "blue")(t)},
		}

		for _, p := range tables {

			resp, _ := http.Post(fmt.Sprintf("%s/api/tables", ts.URL), "application/json", bytes.NewBuffer(p.table))

			if resp.StatusCode != 200 {
				t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
			}
		}

		resp, _ := http.Get(fmt.Sprintf("%s/api/tables", ts.URL))

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

		resp, _ := http.Post(fmt.Sprintf("%s/api/tournaments/%d/tables", ts.URL, id), "application/json", bytes.NewBuffer(table))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}
	}
}

func randomGame(ts *httptest.Server, id uint) func(t *testing.T) []model.GameJson {
	return func(t *testing.T) []model.GameJson {

		resp, _ := http.Get(fmt.Sprintf("%s/api/tournaments/%d/games/random", ts.URL, id))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}

		result := []model.GameJson{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected an list of tables, got %v", err)
		}

		if result[0].LeftScore == 0 {
			t.Fatalf("Expected left greater than 0, got %v", result[0].LeftScore)
		}

		if result[0].RightScore == 0 {
			t.Fatalf("Expected left greater than 0, got %v", result[0].RightScore)
		}

		if result[0].Table.ID == 0 {
			t.Fatalf("Expected table id not equal to 0, got %v", result[0].Table.ID)
		}

		if len(result[0].LeftPlayers) != 1 {
			t.Fatalf("Expected one left player, got %v", len(result[0].LeftPlayers))
		}

		return result
	}
}

func postGame(ts *httptest.Server, tournamentId uint, tableId uint, right []string, left []string, winner string) func(t *testing.T) model.GameJson {
	return func(t *testing.T) model.GameJson {

		game, err := json.Marshal(map[string]interface{}{
			"leftPlayers":  left,
			"rightPlayers": right,
			"winner":       winner,
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		resp, _ := http.Post(fmt.Sprintf("%s/api/tournaments/%d/tables/%d/games", ts.URL, tournamentId, tableId), "application/json", bytes.NewBuffer(game))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}

		result := model.GameJson{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected a game, got %v", err)
		}

		return result
	}
}

func postGameNotValid(ts *httptest.Server, tournamentId uint, tableId uint) func(t *testing.T) {
	return func(t *testing.T) {

		game, err := json.Marshal(map[string]interface{}{
			"leftPlayers":  []string{},
			"rightPlayers": []string{},
			"winner":       "right",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		resp, _ := http.Post(fmt.Sprintf("%s/api/tournaments/%d/tables/%d/games", ts.URL, tournamentId, tableId), "application/json", bytes.NewBuffer(game))

		if resp.StatusCode != 400 {
			t.Fatalf("Expected status code 400, got %v", resp.StatusCode)
		}

		result := resources.ErrorResponse{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected a error, got %v", err)
		}

		if !strings.Contains(result.Error, "RightPlayers") {
			t.Fatalf("Expected a error msg, got %s", result.Error)
		}

	}
}

func getGame(ts *httptest.Server, tournamentId uint) func(t *testing.T) []model.GameJson {
	return func(t *testing.T) []model.GameJson {

		resp, _ := http.Get(fmt.Sprintf("%s/api/tournaments/%d/games", ts.URL, tournamentId))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}

		result := []model.GameJson{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected a list of games, got %v", err)
		}

		return result
	}
}

func getHistory(ts *httptest.Server, tournamentId uint, nickname string) func(t *testing.T) []model.TournamentPlayerHistory {
	return func(t *testing.T) []model.TournamentPlayerHistory {

		resp, _ := http.Get(fmt.Sprintf("%s/api/tournaments/%d/players/%s/history?from=%s", ts.URL, tournamentId, nickname, time.Now().Format("2006-01-02")))

		if resp.StatusCode != 200 {
			t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
		}

		result := []model.TournamentPlayerHistory{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			t.Fatalf("Expected player history, got %v", err)
		}

		return result
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

	random := randomGame(ts, tournament.ID)(t)

	postGame(ts, tournament.ID, random[0].Table.ID, random[0].RightPlayers, random[0].LeftPlayers, string(model.RIGHT))(t)

	games := getGame(ts, tournament.ID)(t)

	if len(games) != 1 {
		t.Fatalf("Expected one game to be played, got %v", len(games))
	}

	if games[0].LeftScore == 0 || games[0].RightScore == 0 {
		t.Fatalf("Expected a score, got left score %v and right score %d", games[0].LeftScore, games[0].RightScore)
	}

	postGameNotValid(ts, tournament.ID, random[0].Table.ID)(t)

	for _, p := range players {
		history := getHistory(ts, tournament.ID, p.Nickname)(t)

		if len(history) < 1 {
			t.Fatalf("Expected player history, got %v", len(history))
		}
	}
}
