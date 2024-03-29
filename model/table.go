package model

// Table used in tournament
type Table struct {
	Base
	Name  string `json:"name" binding:"required" gorm:"type:varchar(50);not null;index:table_name,unique"`
	Color Color  `json:"color" binding:"required" gorm:"embedded"`
} //@name Table

// Color of table
type Color struct {
	Right string `json:"right" binding:"required" gorm:"type:varchar(50);not null"`
	Left  string `json:"left" binding:"required" gorm:"type:varchar(50);not null"`
} //@name Color

// TableRepository provides access games etc.
type TableRepository interface {
	Store(table *Table)
	Remove(id string) Found
	Find(id string) (*Table, Found)
	FindAll() []*Table
	FindAllNotInTournament(id string) []*Table
}

// NewTable creates a new table
func NewTable(name string, color Color) *Table {
	return &Table{
		Name:  name,
		Color: color,
	}
}
