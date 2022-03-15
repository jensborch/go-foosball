package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
	result := r.db.Preload(clause.Associations).Where("uuid = ?", uuid).First(&g)
	return &g, result.RowsAffected > 0, result.Error
}

func (r *gameRepository) FindAll() []*model.Game {
	var games []*model.Game
	r.db.Preload(clause.Associations).Find(&games)
	return games
}

func (r *gameRepository) FindByTournament(id string) []*model.Game {
	var games []*model.Game
	r.db.Preload(clause.Associations).
		Joins("inner join tournament_tables ON games.tournament_table_id == tournament_tables.id").
		Joins("inner join tables ON tournament_tables.id = tables.id").
		Joins("inner join tournaments ON tournaments.id == tournament_tables.tournament_id").
		Where("tournaments.uuid = ?", id).
		Find(&games)
	return games
}

// NewGameRepository creats new repository
func NewGameRepository(db *gorm.DB) model.GameRepository {
	return &gameRepository{
		db: db,
	}
}
