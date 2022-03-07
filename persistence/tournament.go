package persistence

import (
	"math/rand"

	"github.com/jensborch/go-foosball/model"
	"github.com/jinzhu/gorm"
)

type tournamentRepository struct {
	db *gorm.DB
}

func (r *tournamentRepository) Store(t *model.Tournament) error {
	return r.db.Create(t).Error
}

func (r *tournamentRepository) Remove(t *model.Tournament) error {
	return r.db.Where("uuid = ?", t.UUID).Delete(&model.Tournament{}).Error
}

func (r *tournamentRepository) RemoveTable(tournamentUuid string, tableUuid string) (model.Found, error) {
	result := r.db.Model(&model.TournamentTable{}).
		Where("table_id = (?)", r.db.Model(&model.Table{}).
			Select("id").
			Where("uuid = ?", tableUuid).QueryExpr()).
		Where("tournament_id = ?", tournamentUuid).Delete(&model.TournamentTable{})
	return !result.RecordNotFound(), result.Error
}

func (r *tournamentRepository) AddTables(tournamentUuid string, tables ...*model.Table) (model.Found, error) {
	if t, found, err := r.Find(tournamentUuid); err == nil && found {
		for _, table := range tables {
			t := model.NewTournamentTable(t, table)
			if err := r.db.Create(t).Error; err != nil {
				return true, err
			}
		}
		return true, nil
	} else {
		return false, err
	}
}

func (r *tournamentRepository) FindAllTables(uuid string) ([]*model.TournamentTable, model.Found, error) {
	var tables []*model.TournamentTable
	result := r.db.Model(&model.TournamentTable{}).
		Joins("inner join tournament on tournament_table.tournament_id = tournament.id").
		Where("tournament.uuid = ?", uuid).Find(tables)
	return tables, !result.RecordNotFound(), result.Error
}

func (r *tournamentRepository) FindTable(tournamentUuid string, tableUuid string) (*model.TournamentTable, model.Found, error) {
	var table *model.TournamentTable
	result := r.db.Model(&model.TournamentTable{}).
		Joins("inner join tournament on tournament_table.tournament_id = tournament.id").
		Joins("inner join table on tournament_table.table_id = table.id").
		Where("table.uuid = ?", tableUuid).
		Where("tournament.uuid = ?", tournamentUuid).Find(table)
	return table, !result.RecordNotFound(), result.Error
}

func (r *tournamentRepository) AddPlayerWithRanking(uuid string, p *model.Player, ranking uint) (model.Found, error) {
	if t, found, err := r.Find(uuid); err == nil && found {
		tp := model.NewTournamentPlayerWithRanking(p, t, ranking)
		return found, r.db.Create(tp).Error
	} else {
		return found, err
	}
}

func (r *tournamentRepository) AddPlayer(uuid string, p *model.Player) (model.Found, error) {
	if t, found, err := r.Find(uuid); err == nil && found {
		tp := model.NewTournamentPlayer(p, t)
		return found, r.db.Create(tp).Error
	} else {
		return found, err
	}

}

func (r *tournamentRepository) FindAllPlayers(tournamentUuid string) ([]*model.TournamentPlayer, model.Found, error) {
	var players []*model.TournamentPlayer
	result := r.db.Model(&model.TournamentPlayer{}).
		Joins("inner join tournament on tournament_player.tournament_id = tournament.id").
		Where("tournament.id = ?", tournamentUuid).Find(players)
	return players, !result.RecordNotFound(), result.Error
}

func (r *tournamentRepository) FindPlayer(tournamentUuid string, nickname string) (*model.TournamentPlayer, model.Found, error) {
	var players *model.TournamentPlayer
	result := r.db.Model(&model.TournamentPlayer{}).
		Joins("inner join tournament on tournament_player.tournament_id = tournament.id").
		Joins("inner join player on tournament_player.player_id = player.id").
		Where("player.nickname = ?", nickname).
		Where("tournament.id = ?", tournamentUuid).Find(players)
	return players, !result.RecordNotFound(), result.Error
}

func (r *tournamentRepository) ActivePlayers(tournamentUuid string) ([]*model.TournamentPlayer, model.Found, error) {
	var players []*model.TournamentPlayer
	result := r.db.Model(&model.TournamentPlayer{}).
		Joins("inner join tournament on tournament_player.tournament_id = tournament.id").
		Joins("inner join player on tournament_player.player_id = player.id").
		Where("tournament_player.active = ?", true).
		Where("tournament.id = ?", tournamentUuid).Find(players)
	return players, !result.RecordNotFound(), result.Error
}

func (r *tournamentRepository) DeactivatePlayer(tournamentUuid string, nickname string) (model.Found, error) {
	if player, found, err := r.FindPlayer(tournamentUuid, nickname); err == nil && found {
		player.Active = false
		return found, r.db.Save(player).Error
	} else {
		return found, err
	}
}

func (r *tournamentRepository) ActivatePlayer(tournamentUuid string, nickname string) (model.Found, error) {
	if player, found, err := r.FindPlayer(tournamentUuid, nickname); err == nil && found {
		player.Active = true
		return found, r.db.Save(player).Error
	} else {
		return found, err
	}
}

func (r *tournamentRepository) ShuffleActivePlayers(tournamentUuid string) ([]*model.TournamentPlayer, model.Found, error) {
	if players, found, err := r.ActivePlayers(tournamentUuid); err == nil && found {
		rand.Shuffle(len(players), func(i, j int) {
			players[i], players[j] = players[j], players[i]
		})
		return players, found, nil
	} else {
		return []*model.TournamentPlayer{}, found, err
	}
}

func (r *tournamentRepository) RandomGames(tournamentUuid string) ([]*model.Game, model.Found, error) {
	if players, found, err := r.ShuffleActivePlayers(tournamentUuid); err == nil && found {
		games := make([]*model.Game, 0, 2)
		if len(players) >= 2 {
			i := 0
			tables, _, _ := r.FindAllTables(tournamentUuid)
			for _, table := range tables {
				g := model.NewGame(table)
				playersInGameIndex := min(i+4, len(players))
				if playersInGameIndex-i > 1 {
					for ; i < playersInGameIndex; i++ {
						g.AddTournamentPlayer(players[i])
					}
					games = append(games, g)
				}
			}
		}
		return games, found, err
	} else {
		return []*model.Game{}, found, err
	}
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}

func (r *tournamentRepository) Update(t *model.Tournament) error {
	return r.db.Save(t).Error
}

func (r *tournamentRepository) Find(uuid string) (*model.Tournament, model.Found, error) {
	var t model.Tournament
	result := r.db.Where(
		&model.Tournament{UUID: uuid}).First(&t)
	return &t, !result.RecordNotFound(), result.Error
}

func (r *tournamentRepository) FindAll() []*model.Tournament {
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
