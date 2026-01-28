package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
)

type tableRepository struct {
	db *gorm.DB
}

func (r *tableRepository) Store(t *model.Table) {
	if err := r.db.Create(t).Error; err != nil {
		panic(err)
	}
}

func (r *tableRepository) Remove(id string) model.Found {
	result := r.db.Where("ID = ?", id).Delete(&model.Table{})
	if result.Error != nil {
		panic(result.Error)
	}
	return result.RowsAffected > 0
}

func (r *tableRepository) Find(id string) (*model.Table, model.Found) {
	var t model.Table
	result := r.db.Where("ID = ?", id).First(&t)
	return &t, HasBeenFound(result.Error)
}

func (r *tableRepository) FindAll() []*model.Table {
	var tables []*model.Table
	if err := r.db.Order("name").Find(&tables).Error; err != nil {
		panic(err)
	}
	return tables
}

func (r *tableRepository) FindAllNotInTournament(id string) []*model.Table {
	var tables []*model.Table
	sub := r.db.Select("table_id").
		Where("tournament_id = ?", id).
		Table("tournament_tables")
	if err := r.db.Model(&model.Table{}).
		Where("tables.id NOT IN (?)", sub).
		Order("name").
		Find(&tables).Error; err != nil {
		panic(err)
	}
	return tables
}

// NewTableRepository creates a new TableRepository instance.
func NewTableRepository(db *gorm.DB) model.TableRepository {
	return &tableRepository{
		db: db,
	}
}
