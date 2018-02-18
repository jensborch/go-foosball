package model

import (
	"testing"
)

func TestCreateTable(t *testing.T) {
	table := NewTable("test", Color{
		Right: "green",
		Left:  "blue",
	})
	if table.Name != "test" {
		t.Errorf("Table name is incorrect, got: %s, want: %s.", table.Name, "test")
	}
	if len(table.UUID) != 36 {
		t.Errorf("Table must have UUID, got: %s.", table.UUID)
	}
	if table.Color.Left != "blue" {
		t.Errorf("Table must have color, got: %s, wanted %s.", table.Color.Left, "blue")
	}
	if table.Color.Right != "green" {
		t.Errorf("Table must have color, got: %s, wanted %s.", table.Color.Right, "green")
	}
}
