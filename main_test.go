package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"gorm.io/gorm"
)

func startServer() (*httptest.Server, *gorm.DB) {
	if err := os.Remove("test.db"); err != nil {
		fmt.Println("Could not delete test DB", err)
	}
	engine, db := setupServer("test.db")
	return httptest.NewServer(engine), db
}

func TestGet(t *testing.T) {
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
			t.Fatalf("Expected an array of players, got %v", err)
		}

		if len(result) != 0 {
			t.Fatalf("Expected empty array, got %d", len(result))
		}
	}
}

func TestPostPlayers(t *testing.T) {
	ts, _ := startServer()
	defer ts.Close()

	user1, err := json.Marshal(map[string]string{
		"nickname": "u1",
		"realname": "test1",
		"rfid":     "string",
	})

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	user2, err := json.Marshal(map[string]string{
		"nickname": "u2",
		"realname": "test2",
	})

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	resp1, _ := http.Post(fmt.Sprintf("%s/players", ts.URL), "application/json", bytes.NewBuffer(user1))

	if resp1.StatusCode != 201 {
		t.Fatalf("Expected status code 201, got %v", resp1.StatusCode)
	}

	resp2, _ := http.Post(fmt.Sprintf("%s/players", ts.URL), "application/json", bytes.NewBuffer(user2))

	if resp2.StatusCode != 201 {
		t.Fatalf("Expected status code 201, got %v", resp2.StatusCode)
	}
}
