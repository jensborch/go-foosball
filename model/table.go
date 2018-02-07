package model

import (
	"github.com/satori/go.uuid"
)

// Table used in tournament
type Table struct {
	TableID uuid.UUID
	Name    string
	Color   Color
}

// Color of table
type Color struct {
	Right string
	Left  string
}

// Repository provides access games etc.
type TableRepository interface {
	Store(table *Table) error
	Find(id uuid.UUID) (*Table, error)
	FindAll() []*Table
}

// NewTable creates a new table
func NewTable(name string, color Color) *Table {
	id := uuid.Must(uuid.NewV4())
	return &Table{
		TableID: id,
		Name:    name,
		Color:   color,
	}
}
