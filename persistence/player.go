package persistence

import (
	"errors"
	"fmt"

	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
)

type playerRepository struct {
	db *gorm.DB
}

func (r *playerRepository) Store(player *model.Player) error {
	r.db.Unscoped().Where("nickname = ?", player.Nickname).Delete(&model.Player{})
	return r.db.Create(player).Error
}

func (r *playerRepository) Remove(nickname string) (model.Found, error) {
	if len(nickname) > 0 {
		//TODO add check for tournament
		if _, found, _ := r.Find(nickname); found {
			return true, r.db.Where("nickname = ?", nickname).Delete(&model.Player{}).Error
		}
		return false, fmt.Errorf("player %s could not be found or is in tournament", nickname)
	}
	return false, errors.New("nickname must be defined - empty string not allowed")
}

func (r *playerRepository) Update(player *model.Player) error {
	return r.db.Save(player).Error
}

func (r *playerRepository) Find(nickname string) (*model.Player, model.Found, error) {
	var player model.Player
	result := r.db.Where("nickname = ?", nickname).First(&player)
	return &player, result.RowsAffected > 0, result.Error
}

func (r *playerRepository) FindByTournament(id string) []*model.Player {
	var players []*model.Player
	r.db.Joins(
		"LEFT JOIN tournament_players ON tournament_players.player_id = players.id ").Joins(
		"LEFT JOIN tournaments ON tournament_players.tournament_id = tournaments.id").Preload(
		"TournamentPlayers").Where(
		"tournaments.uuid = ?", id).Group("players.nickname").Find(&players)
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
