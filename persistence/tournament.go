package persistence

import (
	"fmt"
	"math/rand"
	"reflect"
	"sort"
	"time"

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
		Where("tournaments.ID = ?", id).
		Find(&tables).Error
	return tables, HasBeenFound(err)
}

func (r *tournamentRepository) FindTable(tournamentId string, tableId string) (*model.TournamentTable, model.Found) {
	var table model.TournamentTable
	err := r.db.Model(&model.TournamentTable{}).
		Preload(clause.Associations).
		Joins("inner join tournaments on tournament_tables.tournament_id = tournaments.id").
		Joins("inner join tables on tournament_tables.table_id = tables.id").
		Where("tables.ID = ?", tableId).
		Where("tournaments.ID = ?", tournamentId).
		Find(&table).Error
	return &table, HasBeenFound(err)
}

func (r *tournamentRepository) AddPlayerWithRanking(id string, p *model.Player, ranking uint) (*model.TournamentPlayer, model.Found) {
	if t, found := r.Find(id); found {
		tp := model.NewTournamentPlayerWithRanking(p, t, ranking)
		r.db.Create(tp)
		r.addHistory(tp)
		return tp, true
	} else {
		return nil, false
	}
}

func (r *tournamentRepository) AddPlayer(id string, p *model.Player) (*model.TournamentPlayer, model.Found) {
	if t, found := r.Find(id); found {
		tp := model.NewTournamentPlayer(p, t)
		r.db.Create(tp)
		r.addHistory(tp)
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
		Where("tournaments.ID = ?", tournamentId).
		Find(&players).Error
	return sortPlayers(players), HasBeenFound(err)
}

func sortPlayers(players []*model.TournamentPlayer) []*model.TournamentPlayer {
	if players != nil {
		sort.Slice(players, func(p, q int) bool {
			return players[p].Player.Nickname < players[q].Player.Nickname
		})
	}
	return players
}

func (r *tournamentRepository) FindPlayer(tournamentId string, nickname string) (*model.TournamentPlayer, model.Found) {
	var player model.TournamentPlayer
	results := r.db.Model(&model.TournamentPlayer{}).
		Preload(clause.Associations).
		Joins("inner join tournaments on tournament_players.tournament_id = tournaments.id").
		Joins("inner join players on tournament_players.player_id = players.id").
		Where("players.nickname = ?", nickname).
		Where("tournaments.ID = ?", tournamentId).
		Find(&player)
	if results.RowsAffected == 1 {
		return &player, true
	} else if results.RowsAffected > 1 {
		panic(fmt.Errorf("found %d players with nickname %s in tournament %s", results.RowsAffected, nickname, tournamentId))
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
		Where("tournaments.ID = ?", tournamentId).
		Find(&players).Error
	return sortPlayers(players), HasBeenFound(err)
}

func (r *tournamentRepository) DeactivatePlayers(tournamentId string) model.Found {
	result := r.db.Model(&model.TournamentPlayer{}).
		Where("tournament_id = ?", tournamentId).
		Update("active", false)
	if result.Error == nil {
		return result.RowsAffected >= 1
	} else {
		panic(fmt.Errorf("error deactivating all players in tournament %s", tournamentId))
	}
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

func (r *tournamentRepository) UpdatePlayerRanking(tournamentId string, nickname string, gameScore int, updated time.Time) (*model.TournamentPlayer, model.Found) {
	if player, found := r.FindPlayer(tournamentId, nickname); found {
		tmp := int(player.Ranking) + gameScore
		println(tmp)
		if tmp >= 0 {
			player.Ranking = uint(tmp)
		} else {
			player.Ranking = 0
		}
		player.Latest = &updated
		if err := r.db.Save(player).Error; err != nil {
			panic(err)
		}
		r.addHistory(player)
		return player, true
	}
	return nil, false
}

func (r *tournamentRepository) addHistory(player *model.TournamentPlayer) {
	if err := r.db.Omit(clause.Associations).Create(model.NewTournamentPlayerHistory(player)).Error; err != nil {
		panic(err)
	}
}

func shufflePlayers(players []*model.TournamentPlayer) []*model.TournamentPlayer {
	rand.Shuffle(len(players), func(i, j int) {
		players[i], players[j] = players[j], players[i]
	})
	length := len(players)
	if length%2 != 0 {
		players = players[:length-1]
	}
	return players
}

func (r *tournamentRepository) ShuffleActivePlayersOld(tournamentId string) ([]*model.TournamentPlayer, model.Found) {
	if players, found := r.ActivePlayers(tournamentId); found {
		return shufflePlayers(players), found
	} else {
		return []*model.TournamentPlayer{}, found
	}
}

func (r *tournamentRepository) ShuffleActivePlayers(tournamentId string) ([]*model.TournamentPlayer, model.Found) {
	if players, found := r.ActivePlayers(tournamentId); found {
		shuffles := [5][]*model.TournamentPlayer{}
		for i := 0; i < 5; i++ {
			shuffles[i] = shufflePlayers(players)
		}
		previous := r.previousGames(tournamentId)
		matches := make([]int, 5)
		for i, shuffle := range shuffles {
			matches[i] = comparPairs(playerPairs(shuffle), previous)
		}
		sort.Ints(matches)
		minIndex := sort.SearchInts(matches, matches[0])
		return shuffles[minIndex], found
	} else {
		return []*model.TournamentPlayer{}, found
	}
}

type pair struct {
	first, second *model.TournamentPlayer
}

func newPair(first *model.TournamentPlayer, second *model.TournamentPlayer) *pair {
	return &pair{
		first:  first,
		second: second,
	}
}

func playerPairs(players []*model.TournamentPlayer) []*pair {
	pairs := make([]*pair, len(players)/2)
	for i := 0; i < len(players); i = i + 2 {
		x := i / 2
		if i != len(players)-1 {
			pairs[x] = newPair(players[i], players[i+1])
		}
	}
	return pairs
}

func comparPairs(newPairs []*pair, oldPairs []*pair) int {
	var numberFound int
	for _, pair := range newPairs {
		numberFound += sort.Search(len(oldPairs), func(i int) bool {
			return reflect.DeepEqual(oldPairs[i], pair)
		})
	}
	return numberFound
}

func (r *tournamentRepository) previousGames(tournamentId string) []*pair {
	gameRepo := NewGameRepository(r.db)
	games := gameRepo.FindByTournament(tournamentId)
	pairs := make([]*pair, 0, len(games)/2)
	for i := 0; i < len(games); i = i + 2 {
		p1 := newPair(&games[i].LeftPlayerOne, &games[i].LeftPlayerTwo)
		p2 := newPair(&games[i].RightPlayerOne, &games[i].RightPlayerTwo)
		pairs[i] = p1
		pairs[i+1] = p2
	}
	return pairs
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
	r.db.Order("name").Find(&tournaments)
	return tournaments
}

func (r *tournamentRepository) PlayerHistory(tournamentId string, nickname string, from time.Time) ([]*model.TournamentPlayerHistory, model.Found) {
	if player, found := r.FindPlayer(tournamentId, nickname); found {
		var history []*model.TournamentPlayerHistory
		r.db.
			Where("tournament_player_id = ?", player.ID).
			Where("updated_at >= ?", from).
			Order("updated_at").
			Find(&history)
		return history, true
	}
	return nil, false
}

func (r *tournamentRepository) History(tournamentId string, from time.Time) ([]*model.TournamentPlayerHistory, model.Found) {
	if _, found := r.Find(tournamentId); found {
		var history []*model.TournamentPlayerHistory
		r.db.Model(&model.TournamentPlayerHistory{}).
			Distinct().
			Preload("TournamentPlayer.Player").
			Joins("inner join tournament_players on tournament_players.id = tournament_player_histories.tournament_player_id").
			Where("tournament_players.tournament_id = ?", tournamentId).
			Where("tournament_player_histories.updated_at >= ?", from).
			Order("tournament_player_histories.updated_at DESC").
			Find(&history)
		return history, true
	}
	return nil, false
}

// NewTournamentRepository creats new repository
func NewTournamentRepository(db *gorm.DB) model.TournamentRepository {
	return &tournamentRepository{
		db: db,
	}
}
