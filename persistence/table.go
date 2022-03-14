package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
)

type tableRepository struct {
	db *gorm.DB
}

func (r *tableRepository) Store(t *model.Table) error {
	return r.db.Create(t).Error
}

func (r *tableRepository) Remove(t *model.Table) error {
	return r.db.Where("uuid = ?", t.UUID).Delete(&model.Table{}).Error
}

func (r *tableRepository) Find(uuid string) (*model.Table, model.Found, error) {
	var t model.Table
	rersult := r.db.Where("uuid = ?", uuid).First(&t)
	return &t, rersult.RowsAffected > 0, rersult.Error
}

func (r *tableRepository) FindAll() []*model.Table {
	var tables []*model.Table
	r.db.Find(&tables)
	return tables
}

// NewTableRepository creats new repository
func NewTableRepository(db *gorm.DB) model.TableRepository {
	return &tableRepository{
		db: db,
	}
}
