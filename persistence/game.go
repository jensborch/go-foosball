package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
)

type gameRepository struct {
	db *gorm.DB
}

func (r *gameRepository) Store(g *model.Game) error {
	return r.db.Create(g).Error
}

func (r *gameRepository) Remove(g *model.Game) error {
	return r.db.Where("uuid = ?", g.UUID).Delete(&model.Game{}).Error
}

func (r *gameRepository) Find(uuid string) (*model.Game, error) {
	var g model.Game
	return &g, r.db.Where("uuid = ?", uuid).First(&g).Error
}

func (r *gameRepository) FindAll() []*model.Game {
	var games []*model.Game
	r.db.Find(&games)
	return games
}

// NewGameRepository creats new repository
func NewGameRepository(db *gorm.DB) model.GameRepository {
	return &gameRepository{
		db: db,
	}
}
