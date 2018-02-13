package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
)

type tournamentRepository struct {
	db *gorm.DB
}

func (r tournamentRepository) Store(t *model.Tournament) error {
	return r.db.Create(t).Error
}

func (r tournamentRepository) Remove(t *model.Tournament) error {
	return r.db.Where("uuid = ?", t.UUID).Delete(&model.Tournament{}).Error
}

func (r tournamentRepository) Find(uuid string) (*model.Tournament, model.Found, error) {
	var t model.Tournament
	return &t, !r.db.Where("uuid = ?", uuid).First(&t).RecordNotFound(), r.db.Error
}

func (r tournamentRepository) FindAll() []*model.Tournament {
	var tournaments []*model.Tournament
	r.db.Find(&tournaments)
	return tournaments
}

// NewTournamentRepository creats new repository
func NewTournamentRepository(db *gorm.DB) model.TournamentRepository {
	return &tournamentRepository{
		db: db,
	}
}
