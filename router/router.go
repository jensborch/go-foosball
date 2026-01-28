package router

import (
	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/resources"
	"gorm.io/gorm"
)

// SetupAPIRoutes configures all API routes for the application.
func SetupAPIRoutes(router *gin.Engine, db *gorm.DB) {
	api := router.Group("/api")
	api.Use(gin.Recovery(), resources.ErrorHandlerMiddleware(), resources.TransactionMiddleware(db))

	setupPlayerRoutes(api)
	setupTableRoutes(api)
	setupTournamentRoutes(api)
	setupGameRoutes(api)
}

// setupPlayerRoutes configures routes for player management.
func setupPlayerRoutes(api *gin.RouterGroup) {
	players := api.Group("/players")
	players.GET("", resources.GetPlayers())
	players.POST("", resources.PostPlayer())
	players.GET("/:name", resources.GetPlayer("name"))
	players.DELETE("/:name", resources.DeletePlayer("name"))
}

// setupTableRoutes configures routes for table management.
func setupTableRoutes(api *gin.RouterGroup) {
	tables := api.Group("/tables")
	tables.GET("", resources.GetTables())
	tables.POST("", resources.PostTable())
	tables.GET("/:id", resources.GetTable("id"))
}

// setupTournamentRoutes configures routes for tournament management.
func setupTournamentRoutes(api *gin.RouterGroup) {
	tournaments := api.Group("/tournaments")

	// Tournament CRUD
	tournaments.GET("", resources.GetTournaments())
	tournaments.POST("", resources.PostTournament())
	tournaments.GET("/:id", resources.GetTournament("id"))
	tournaments.DELETE("/:id", resources.DeleteTournament("id"))

	// Tournament players
	tournaments.GET("/:id/players", resources.GetTournamentPlayers("id"))
	tournaments.POST("/:id/players", resources.PostTournamentPlayer("id"))
	tournaments.PUT("/:id/players/:name", resources.UpdateTournamentPlayerStatus("id", "name"))
	tournaments.DELETE("/:id/players", resources.DeleteAllTournamentPlayers("id"))
	tournaments.GET("/:id/players/:name/history", resources.GetTournamentPlayerHistory("id", "name"))
	tournaments.GET("/:id/history", resources.GetTournamentHistory("id"))

	// Tournament tables
	tournaments.GET("/:id/tables", resources.GetTournamentTables("id"))
	tournaments.POST("/:id/tables", resources.PostTournamentTables("id"))
	tournaments.DELETE("/:id/tables/:table", resources.DeleteTournamentTable("id", "table"))

	// Tournament games
	tournaments.POST("/:id/tables/:table/games", resources.PostGame("id", "table"))
	tournaments.GET("/:id/games", resources.GetGamesInTournament("id"))

	// Actions
	tournaments.GET("/:id/games/random", resources.GetRandomGames("id"))
	tournaments.GET("/:id/games/start", resources.GetGameStart("id"))

	// Events (WebSocket)
	tournaments.GET("/:id/events/player", resources.GetPlayerEvents("id"))
	tournaments.GET("/:id/events/game", resources.GetGameEvents("id"))
}

// setupGameRoutes configures routes for game queries.
func setupGameRoutes(api *gin.RouterGroup) {
	games := api.Group("/games")
	games.GET("", resources.GetGames())
	games.GET("/:id", resources.GetGame("id"))
}
