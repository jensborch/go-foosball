package router

import (
	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/resources"
	"gorm.io/gorm"
)

// SetupAPIRoutes configures all API routes for the application.
func SetupAPIRoutes(router *gin.Engine, db *gorm.DB) {
	api := router.Group("/api")

	setupPlayerRoutes(api, db)
	setupTableRoutes(api, db)
	setupTournamentRoutes(api, db)
	setupGameRoutes(api, db)
}

// setupPlayerRoutes configures routes for player management.
func setupPlayerRoutes(api *gin.RouterGroup, db *gorm.DB) {
	players := api.Group("/players")
	players.GET("", resources.GetPlayers(db))
	players.POST("", resources.PostPlayer(db))
	players.GET("/:name", resources.GetPlayer("name", db))
	players.DELETE("/:name", resources.DeletePlayer("name", db))
}

// setupTableRoutes configures routes for table management.
func setupTableRoutes(api *gin.RouterGroup, db *gorm.DB) {
	tables := api.Group("/tables")
	tables.GET("", resources.GetTables(db))
	tables.POST("", resources.PostTable(db))
	tables.GET("/:id", resources.GetTable("id", db))
}

// setupTournamentRoutes configures routes for tournament management.
func setupTournamentRoutes(api *gin.RouterGroup, db *gorm.DB) {
	tournaments := api.Group("/tournaments")

	// Tournament CRUD
	tournaments.GET("", resources.GetTournaments(db))
	tournaments.POST("", resources.PostTournament(db))
	tournaments.GET("/:id", resources.GetTournament("id", db))
	tournaments.DELETE("/:id", resources.DeleteTournament("id", db))

	// Tournament players
	tournaments.GET("/:id/players", resources.GetTournamentPlayes("id", db))
	tournaments.POST("/:id/players", resources.PostTournamentPlayer("id", db))
	tournaments.PUT("/:id/players/:name", resources.UpdateTournamentPlayerStatus("id", "name", db))
	tournaments.DELETE("/:id/players", resources.DeleteAllTournamentPlayers("id", db))
	tournaments.GET("/:id/players/:name/history", resources.GetTournamentPlayeHistory("id", "name", db))
	tournaments.GET("/:id/history", resources.GetTournamentHistory("id", db))

	// Tournament tables
	tournaments.GET("/:id/tables", resources.GetTournamentTables("id", db))
	tournaments.POST("/:id/tables", resources.PostTournamentTables("id", db))
	tournaments.DELETE("/:id/tables/:table", resources.DeleteTournamentTable("id", "table", db))

	// Tournament games
	tournaments.POST("/:id/tables/:table/games", resources.PostGame("id", "table", db))
	tournaments.GET("/:id/games", resources.GetGamesInTournament("id", db))

	// Actions
	tournaments.GET("/:id/games/random", resources.GetRandomGames("id", db))
	tournaments.GET("/:id/games/start", resources.GetGameStart("id", db))

	// Events (WebSocket)
	tournaments.GET("/:id/events/player", resources.GetPlayerEvents("id"))
	tournaments.GET("/:id/events/game", resources.GetGameEvents("id"))
}

// setupGameRoutes configures routes for game queries.
func setupGameRoutes(api *gin.RouterGroup, db *gorm.DB) {
	games := api.Group("/games")
	games.GET("", resources.GetGames(db))
	games.GET("/:id", resources.GetGame("id", db))
}
