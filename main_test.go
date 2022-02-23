package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
)

func startServer() (*httptest.Server, *gorm.DB) {
	if err := os.Remove("test.db"); err != nil {
		fmt.Println("Could not delete test DB", err)
	}
	engine, db := setupServer("test.db")
	return httptest.NewServer(engine), db
}

func TestGetPlayers(t *testing.T) {
	ts, db := startServer()
	defer ts.Close()
	defer db.Close()

	resp, err := http.Get(fmt.Sprintf("%s/players", ts.URL))

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if resp.StatusCode != 200 {
		t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
	}

	result := []model.Player{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatalf("Expected an array of players, got %v", err)
	}

	if len(result) != 0 {
		t.Fatalf("Expected empty array, got %d", len(result))
	}

}
