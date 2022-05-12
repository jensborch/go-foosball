package model

// Table used in tournament
type Table struct {
	Base
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
	Remove(id string) Found
	Find(id string) (*Table, Found)
	FindAll() []*Table
}

// NewTable creates a new table
func NewTable(name string, color Color) *Table {
	return &Table{
		Name:  name,
		Color: color,
	}
}
