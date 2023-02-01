package persistence

import (
	"testing"

	_ "github.com/glebarez/sqlite"
	"github.com/jensborch/go-foosball/model"
)

func TestRemoveNotFound(t *testing.T) {
	db := InitDB(t)
	r := NewPlayerRepository(db)
	if f := r.Remove("test"); f {
		t.Errorf("Player should not be found")
	}
}

func TestStorePlayer(t *testing.T) {
	db := InitDB(t)

	p1 := model.NewPlayer("tt", "Thomas", "rfid1")
	p2 := model.NewPlayer("jj", "Jens", "rfid2")

	r := NewPlayerRepository(db)

	r.Store(p1)
	r.Store(p2)

	if len(r.FindAll()) != 2 {
		t.Errorf("FindAll should return all playes, got: %d, want: %d.", len(r.FindAll()), 2)
	}

	found, _ := r.Find("jj")

	if found.Nickname != "jj" {
		t.Errorf("Find should find player, got: %s, want: %s.", found.Nickname, "jj")
	}

	if f := r.Remove(p1.Nickname); !f {
		t.Errorf("Failed to remove or find player, found is %v", f)
	}

	if len(r.FindAll()) != 1 {
		t.Errorf("FindAll should return only 1 player afer delete, got: %d", len(r.FindAll()))
	}

}

func TestUpdatePlayer(t *testing.T) {
	p := model.NewPlayer("tt", "Thomas", "rfid")
	db := InitDB(t)

	pr := NewPlayerRepository(db)
	pr.Store(p)

	p.RealName = "t2"
	pr.Update(p)

	found, _ := pr.Find("tt")

	if found.RealName != "t2" {
		t.Errorf("Find should find player with updated name, got: %s, want: %s.", found.RealName, "t2")
	}

}
