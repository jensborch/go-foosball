package persistence

import (
	"testing"

	"github.com/jensborch/go-foosball/model"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func TestRemoveNotFound(t *testing.T) {
	db := InitDB(t)
	defer db.Close()
	r := NewPlayerRepository(db)
	if f, _ := r.Remove("test"); f {
		t.Errorf("Player should not be found")
	}
}

func TestStorePlayer(t *testing.T) {
	db := InitDB(t)
	defer db.Close()

	p1 := model.NewPlayer("tt", "Thomas", "rfid1")
	p2 := model.NewPlayer("jj", "Jens", "rfid2")

	r := NewPlayerRepository(db)

	r.Store(p1)
	r.Store(p2)

	if len(r.FindAll()) != 2 {
		t.Errorf("FindAll should return all playes, got: %d, want: %d.", len(r.FindAll()), 2)
	}

	found, _, err := r.Find("jj")
	if err != nil {
		t.Errorf("Failed to find player")
	}

	if found.Nickname != "jj" {
		t.Errorf("Find should find player, got: %s, want: %s.", found.Nickname, "jj")
	}

	if f, err := r.Remove(p1.Nickname); !f || err != nil {
		t.Errorf("Failed to remove or find player, found is %v, error is %v", f, err)
	}

	if len(r.FindAll()) != 1 {
		t.Errorf("FindAll should return only 1 player afer delete, got: %d", len(r.FindAll()))
	}

}

func TestUpdatePlayer(t *testing.T) {
	p := model.NewPlayer("tt", "Thomas", "rfid")
	db := InitDB(t)
	defer db.Close()

	pr := NewPlayerRepository(db)
	pr.Store(p)

	p.RealName = "t2"
	pr.Update(p)

	found, _, err := pr.Find("tt")
	if err != nil {
		t.Errorf("Failed to find player")
	}

	if found.RealName != "t2" {
		t.Errorf("Find should find player with updated name, got: %s, want: %s.", found.RealName, "t2")
	}

}
