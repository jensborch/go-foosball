package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
)

type playerRepository struct {
	db *gorm.DB
}

func (r playerRepository) Store(player *model.Player) error {
	return r.db.Create(player).Error
}

func (r playerRepository) Find(nickname string) (*model.Player, error) {
	var player model.Player
	return &player, r.db.Where("nickname = ?", nickname).First(&player).Error
}

func (r playerRepository) FindAll() []*model.Player {
	return nil
}

// NewPlayerRepository creats new repository
func NewPlayerRepository(db *gorm.DB) model.PlayerRepository {
	return &playerRepository{
		db: db,
	}
}
