package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
)

type playerRepository struct {
	db *gorm.DB
}

func (r *playerRepository) Store(player *model.Player) {
	r.db.Unscoped().Where("nickname = ?", player.Nickname).Delete(&model.Player{})
	if err := r.db.Create(player).Error; err != nil {
		panic(err)
	}
}

func (r *playerRepository) Remove(nickname string) model.Found {
	if len(nickname) > 0 {
		//TODO add check for tournament
		if _, found := r.Find(nickname); found {
			if err := r.db.Where("nickname = ?", nickname).Delete(&model.Player{}).Error; err != nil {
				panic(err)
			} else {
				return true
			}
		}
	}
	return false
}

func (r *playerRepository) Update(player *model.Player) {
	if err := r.db.Save(player).Error; err != nil {
		panic(err)
	}
}

func (r *playerRepository) Find(nickname string) (*model.Player, model.Found) {
	var player model.Player
	result := r.db.Where("nickname = ?", nickname).First(&player)
	return &player, HasBeenFound(result.Error)
}

func (r *playerRepository) FindByTournament(id string) []*model.Player {
	var players []*model.Player
	r.db.Joins(
		"LEFT JOIN tournament_players ON tournament_players.player_id = players.id ").Joins(
		"LEFT JOIN tournaments ON tournament_players.tournament_id = tournaments.id").Preload(
		"TournamentPlayers").Where(
		"tournaments.ID = ?", id).Group("players.nickname").Find(&players)
	return players
}

func (r *playerRepository) FindAll() []*model.Player {
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
