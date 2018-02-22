package persistence

import (
	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
)

type playerRepository struct {
	db *gorm.DB
}

func (r *playerRepository) Store(player *model.Player) error {
	return r.db.Create(player).Error
}

func (r *playerRepository) Remove(player *model.Player) error {
	return r.db.Where("nickname = ?", player.Nickname).Delete(&model.Player{}).Error
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
		"JOIN tournament_players ON tournament_players.player_id = players.id "+
			"JOIN tournaments ON tournament_players.tournament_id = tournaments.id").Preload(
		"TournamentPlayers").Preload(
		"TournamentPlayers.Tournament").Where(
		"tournaments.uuid = ?", id).First(&players)
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
