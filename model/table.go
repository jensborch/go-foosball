package model

import (
	"github.com/jinzhu/gorm"
	"github.com/satori/go.uuid"
)

// Table used in tournament
type Table struct {
	gorm.Model `json:"-"`
	UUID       string `json:"uuid" gorm:"size:36;unique_index"`
	Name       string `json:"name" gorm:"type:varchar(50)"`
	Color      Color  `gorm:"embedded"`
}

// Color of table
type Color struct {
	Right string `json:"right" gorm:"type:varchar(50)"`
	Left  string `json:"left" gorm:"type:varchar(50)"`
}

// TableRepository provides access games etc.
type TableRepository interface {
	Store(table *Table) error
	Remove(table *Table) error
	Find(uuid string) (*Table, error)
	FindAll() []*Table
}

// NewTable creates a new table
func NewTable(name string, color Color) *Table {
	id := uuid.Must(uuid.NewV4()).String()
	return &Table{
		UUID:  id,
		Name:  name,
		Color: color,
	}
}
