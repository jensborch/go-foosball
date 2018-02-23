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

func (r *gameRepository) Find(uuid string) (*model.Game, model.Found, error) {
	var g model.Game
	return &g, !r.db.Where("uuid = ?", uuid).First(&g).RecordNotFound(), r.db.Error
}

func (r *gameRepository) FindAll() []*model.Game {
	var games []*model.Game
	r.db.Find(&games)
	return games
}

func (r *gameRepository) FindByTournament(id string) []*model.Game {
	var games []*model.Game
	r.db.Joins(
		"JOIN tournament_tables ON games.tournament_table_id == tournament_tables.id "+
			"JOIN tournaments ON tournaments.id == tournament_tables.tournament_id").Where(
		"tournaments.uuid = ?", id).Find(&games)
	return games
}

// NewGameRepository creats new repository
func NewGameRepository(db *gorm.DB) model.GameRepository {
	return &gameRepository{
		db: db,
	}
}
