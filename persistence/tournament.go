package persistence

import (
	"math/rand"

	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type tournamentRepository struct {
	db *gorm.DB
}

func (r *tournamentRepository) Store(t *model.Tournament) {
	if err := r.db.Create(t).Error; err != nil {
		panic(err)
	}
}

func (r *tournamentRepository) Remove(id string) model.Found {
	err := r.db.Where("ID = ?", id).Delete(&model.Tournament{}).Error
	return HasBeenFound(err)
}

func (r *tournamentRepository) RemoveTable(tournamentId string, tableId string) model.Found {
	err := r.db.Model(&model.TournamentTable{}).
		Where("table_id = (?)", r.db.Model(&model.Table{}).
			Select("id").
			Where("ID = ?", tableId)).
		Where("tournament_id = (?)", r.db.Model(&model.Tournament{}).
			Select("id").
			Where("ID = ?", tournamentId)).
		Delete(&model.TournamentTable{}).Error
	return HasBeenFound(err)
}

func (r *tournamentRepository) AddTables(tournamentId string, table *model.Table) (*model.TournamentTable, model.Found) {
	if t, found := r.Find(tournamentId); found {
		t := model.NewTournamentTable(t, table)
		if err := r.db.Create(t).Error; err != nil {
			panic(err)
		}
		return t, true
	} else {
		return nil, false
	}
}

func (r *tournamentRepository) FindAllTables(id string) ([]*model.TournamentTable, model.Found) {
	var tables []*model.TournamentTable
	err := r.db.Model(&model.TournamentTable{}).
		Preload(clause.Associations).
		Joins("join tournaments on tournament_tables.tournament_id = tournaments.id").
		Where("tournaments.ID = ?", id).Find(&tables).Error
	return tables, HasBeenFound(err)
}

func (r *tournamentRepository) FindTable(tournamentId string, tableId string) (*model.TournamentTable, model.Found) {
	var table model.TournamentTable
	err := r.db.Model(&model.TournamentTable{}).
		Preload(clause.Associations).
		Joins("inner join tournaments on tournament_tables.tournament_id = tournaments.id").
		Joins("inner join tables on tournament_tables.table_id = tables.id").
		Where("tables.ID = ?", tableId).
		Where("tournaments.ID = ?", tournamentId).Find(&table).Error
	return &table, HasBeenFound(err)
}

func (r *tournamentRepository) AddPlayerWithRanking(id string, p *model.Player, ranking uint) (*model.TournamentPlayer, model.Found) {
	if t, found := r.Find(id); found {
		tp := model.NewTournamentPlayerWithRanking(p, t, ranking)
		r.db.Create(tp)
		/*if err := r.db.Create(tp); err != nil {
			panic(err)
		}*/
		return tp, true
	} else {
		return nil, false
	}
}

func (r *tournamentRepository) AddPlayer(id string, p *model.Player) (*model.TournamentPlayer, model.Found) {
	if t, found := r.Find(id); found {
		tp := model.NewTournamentPlayer(p, t)
		r.db.Create(tp)
		/*if err := r.db.Create(tp); err != nil {
			panic(err)
		}*/
		return tp, true
	} else {
		return nil, false
	}
}

func (r *tournamentRepository) FindAllActivePlayers(tournamentId string) ([]*model.TournamentPlayer, model.Found) {
	var players []*model.TournamentPlayer
	err := r.db.Model(&model.TournamentPlayer{}).
		Preload(clause.Associations).
		Joins("inner join tournaments on tournament_players.tournament_id = tournaments.id").
		Where("tournaments.ID = ?", tournamentId).Find(&players).Error
	return players, HasBeenFound(err)
}

func (r *tournamentRepository) FindPlayer(tournamentId string, nickname string) (*model.TournamentPlayer, model.Found) {
	var player model.TournamentPlayer
	results := r.db.Model(&model.TournamentPlayer{}).
		Preload(clause.Associations).
		Joins("inner join tournaments on tournament_players.tournament_id = tournaments.id").
		Joins("inner join players on tournament_players.player_id = players.id").
		Where("players.nickname = ?", nickname).
		Where("tournaments.ID = ?", tournamentId).Scan(&player)
	if results.RowsAffected > 0 {
		return &player, true
	} else {
		return nil, false
	}
}

func (r *tournamentRepository) ActivePlayers(tournamentId string) ([]*model.TournamentPlayer, model.Found) {
	var players []*model.TournamentPlayer
	err := r.db.Model(&model.TournamentPlayer{}).
		Preload(clause.Associations).
		Joins("inner join tournaments on tournament_players.tournament_id = tournaments.id").
		Joins("inner join players on tournament_players.player_id = players.id").
		Where("tournament_players.active = ?", true).
		Where("tournaments.ID = ?", tournamentId).Find(&players).Error
	return players, HasBeenFound(err)
}

func (r *tournamentRepository) DeactivatePlayer(tournamentId string, nickname string) (*model.TournamentPlayer, model.Found) {
	if player, found := r.FindPlayer(tournamentId, nickname); found {
		player.Active = false
		if err := r.db.Save(player).Error; err != nil {
			panic(err)
		}
		return player, true
	}
	return nil, false
}

func (r *tournamentRepository) ActivatePlayer(tournamentId string, nickname string) (*model.TournamentPlayer, model.Found) {
	if player, found := r.FindPlayer(tournamentId, nickname); found {
		player.Active = true
		if err := r.db.Save(player).Error; err != nil {
			panic(err)
		}
		return player, true
	}
	return nil, false
}

func (r *tournamentRepository) ShuffleActivePlayers(tournamentId string) ([]*model.TournamentPlayer, model.Found) {
	if players, found := r.ActivePlayers(tournamentId); found {
		rand.Shuffle(len(players), func(i, j int) {
			players[i], players[j] = players[j], players[i]
		})
		return players, found
	} else {
		return []*model.TournamentPlayer{}, found
	}
}

func (r *tournamentRepository) RandomGames(tournamentId string) ([]*model.Game, model.Found) {
	if players, found := r.ShuffleActivePlayers(tournamentId); found {
		games := make([]*model.Game, 0, 2)
		if len(players) >= 2 {
			i := 0
			tables, _ := r.FindAllTables(tournamentId)
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
		return games, found
	} else {
		return []*model.Game{}, found
	}
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}

func (r *tournamentRepository) Update(t *model.Tournament) {
	if err := r.db.Save(t).Error; err != nil {
		panic(err)
	}
}

func (r *tournamentRepository) Find(id string) (*model.Tournament, model.Found) {
	var t model.Tournament
	error := r.db.First(&t, id).Error
	return &t, HasBeenFound(error)
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
