package model

import (
	"testing"
)

func TestCreatePlayer(t *testing.T) {
	p := NewPlayer("jj", "Jens")

	if p.Nickname != "jj" {
		t.Errorf("Player nickname is incorrect, got: %s, want: %s.", p.Nickname, "jj")
	}

	if p.RealName != "Jens" {
		t.Errorf("Player name is incorrect, got: %s, want: %s.", p.RealName, "Jens")
	}

	if p.RFID != "" {
		t.Errorf("Player RFID must be empty")
	}

}
