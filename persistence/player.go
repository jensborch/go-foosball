package persistence

import (
	"errors"
	"fmt"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
)

type playerRepository struct {
	db *gorm.DB
}

func (r *playerRepository) Store(player *model.Player) error {
	return r.db.Create(player).Error
}

func (r *playerRepository) Remove(nickname string) (model.Found, error) {
	if len(nickname) > 0 {
		p, found, _ := r.Find(nickname)
		if found && len(p.TournamentPlayers) == 0 {
			result := r.db.Where("nickname = ?", nickname).Delete(&model.Player{})
			return result.RecordNotFound(), result.Error
		}
		return found, fmt.Errorf("Player %s could not be found or is in tournament", nickname)
	}
	return false, errors.New("Nickname must be defined - empty string not allowed")
}

func (r *playerRepository) Update(player *model.Player) error {
	return r.db.Save(player).Error
}

func (r *playerRepository) Find(nickname string) (*model.Player, model.Found, error) {
	var player model.Player
	return &player, !r.db.Preload(
		"TournamentPlayers").Preload(
		"TournamentPlayers.Tournament").Where(
		"nickname = ?", nickname).First(&player).RecordNotFound(), r.db.Error
}

func (r *playerRepository) FindByTournament(id string) []*model.Player {
	var players []*model.Player
	r.db.Joins(
		"LEFT JOIN tournament_players ON tournament_players.player_id = players.id "+
			"LEFT JOIN tournaments ON tournament_players.tournament_id = tournaments.id").Preload(
		"TournamentPlayers").Preload(
		"TournamentPlayers.Tournament").Where(
		"tournaments.uuid = ?", id).Group("players.nickname").Find(&players)
	return players
}

func (r *playerRepository) FindAll() []*model.Player {
	var players []*model.Player
	r.db.Preload(
		"TournamentPlayers").Preload(
		"TournamentPlayers.Tournament").Find(&players)
	return players
}

// NewPlayerRepository creats new repository
func NewPlayerRepository(db *gorm.DB) model.PlayerRepository {
	return &playerRepository{
		db: db,
	}
}
