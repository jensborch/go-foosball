package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type gameRepository struct {
	db *gorm.DB
}

func (r *gameRepository) Store(g *model.Game) {
	if err := r.db.Create(g).Error; err != nil {
		panic(err)
	}
}

func (r *gameRepository) Remove(id string) model.Found {
	err := r.db.Where("ID = ?", id).Delete(&model.Game{}).Error
	return HasBeenFound(err)
}

func (r *gameRepository) Find(id string) (*model.Game, model.Found) {
	var g model.Game
	result := r.db.
		Preload("RightPlayerOne.Player").
		Preload("RightPlayerTwo.Player").
		Preload("LeftPlayerOne.Player").
		Preload("LeftPlayerTwo.Player").
		Preload(clause.Associations).Where("ID = ?", id).First(&g)
	return &g, HasBeenFound(result.Error)
}

func (r *gameRepository) FindAll() []*model.Game {
	var games []*model.Game
	if err := r.db.
		Preload("RightPlayerOne.Player").
		Preload("RightPlayerTwo.Player").
		Preload("LeftPlayerOne.Player").
		Preload("LeftPlayerTwo.Player").
		Preload(clause.Associations).Find(&games).Error; err != nil {
		panic(err)
	}
	return games
}

func (r *gameRepository) FindByTournament(id string) []*model.Game {
	var games []*model.Game
	if err := r.db.Model(&model.Game{}).
		Preload("RightPlayerOne.Player").
		Preload("RightPlayerTwo.Player").
		Preload("LeftPlayerOne.Player").
		Preload("LeftPlayerTwo.Player").
		Preload(clause.Associations).
		Joins("inner join tournament_tables on games.tournament_table_id == tournament_tables.id").
		Joins("inner join tables on tournament_tables.table_id = tables.id").
		Joins("inner join tournaments on tournaments.id == tournament_tables.tournament_id").
		Where("tournaments.ID = ?", id).
		Find(&games).Error; err != nil {
		panic(err)
	}
	return games
}

// NewGameRepository creats new repository
func NewGameRepository(db *gorm.DB) model.GameRepository {
	return &gameRepository{
		db: db,
	}
}
