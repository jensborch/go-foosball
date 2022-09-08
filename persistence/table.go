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
	return HasBeenFound(r.db.Where("ID = ?", id).Delete(&model.Table{}).Error)
}

func (r *tableRepository) Find(id string) (*model.Table, model.Found) {
	var t model.Table
	rersult := r.db.Where("ID = ?", id).First(&t)
	return &t, HasBeenFound(rersult.Error)
}

func (r *tableRepository) FindAll() []*model.Table {
	var tables []*model.Table
	r.db.Order("name").Find(&tables)
	return tables
}

func (r *tableRepository) FindAllNotInTournament(id string) []*model.Table {
	var tables []*model.Table
	sub := r.db.Select("table_id").
		Where("tournament_id = ?", id).
		Table("tournament_tables")
	r.db.Model(&model.Table{}).
		Where("tables.id NOT IN (?)", sub).
		Order("name").
		Find(&tables)
	return tables
}

// NewTableRepository creats new repository
func NewTableRepository(db *gorm.DB) model.TableRepository {
	return &tableRepository{
		db: db,
	}
}
