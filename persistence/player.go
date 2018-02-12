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

func (r playerRepository) Remove(player *model.Player) error {
	return r.db.Where("nickname = ?", player.Nickname).Delete(&model.Player{}).Error
}

func (r playerRepository) Find(nickname string) (*model.Player, model.Found, error) {
	var player model.Player
	return &player, !r.db.Where("nickname = ?", nickname).First(&player).RecordNotFound(), r.db.Error
}

func (r playerRepository) FindAll() []*model.Player {
	var players []*model.Player
	r.db.Find(&players)
	return players
}

// NewPlayerRepository creats new repository
func NewPlayerRepository(db *gorm.DB) model.PlayerRepository {
	return &playerRepository{
		db: db,
	}
}
