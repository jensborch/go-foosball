package model

import (
	uuid "github.com/satori/go.uuid"
)

// Table used in tournament
type Table struct {
	Base
	UUID  string `json:"uuid" gorm:"size:36;unique_index"`
	Name  string `json:"name" binding:"required" gorm:"type:varchar(50)"`
	Color Color  `json:"color" binding:"required" gorm:"embedded"`
}

// Color of table
type Color struct {
	Right string `json:"right" binding:"required" gorm:"type:varchar(50)"`
	Left  string `json:"left" binding:"required" gorm:"type:varchar(50)"`
}

// TableRepository provides access games etc.
type TableRepository interface {
	Store(table *Table)
	Remove(uuid string) Found
	Find(uuid string) (*Table, Found)
	FindAll() []*Table
}

// NewTable creates a new table
func NewTable(name string, color Color) *Table {
	id := uuid.Must(uuid.NewV4(), nil).String()
	return &Table{
		UUID:  id,
		Name:  name,
		Color: color,
	}
}
