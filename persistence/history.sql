-- SQLite
SELECT 
players.nickname,
tournament_player_histories.ranking, 
max(tournament_player_histories.updated_at) as max,
min(tournament_player_histories.updated_at) as min
FROM tournament_player_histories
INNER JOIN tournament_players on tournament_players.id = tournament_player_histories.tournament_player_id
INNER JOIN players on tournament_players.player_id = players.id
GROUP BY players.nickname;

