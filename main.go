package main

import (
	"embed"
	"flag"
	"io/fs"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	_ "github.com/jensborch/go-foosball/docs"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/resources"

	"gorm.io/driver/sqlite"
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// @title           Go-foosball API
// @version         0.8
// @description     Foosball tournament REST service.

// @BasePath /

// React client static web server content.
//go:embed client/build
var client embed.FS

// Static html for testing.
//go:embed html
var html embed.FS

func main() {
	var (
		port   uint
		dbfile string
	)
	flag.UintVar(&port, "port", 8080, "the port number")
	flag.StringVar(&dbfile, "db", "foosball.db", "the database file")
	flag.Parse()

	engine, _ := setupServer(dbfile)
	engine.Run(":" + strconv.FormatUint(uint64(port), 10))
}

func setupServer(dbfile string) (*gin.Engine, *gorm.DB) {
	router := gin.Default()
	corsConf := cors.DefaultConfig()
	corsConf.AllowAllOrigins = true
	corsConf.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "HEAD"}
	router.Use(cors.New(corsConf))

	db, err := gorm.Open(sqlite.Open(dbfile), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&model.Tournament{}, &model.TournamentTable{}, &model.Table{}, &model.Player{}, &model.TournamentPlayer{}, &model.Game{})

	players := router.Group("/players/")
	players.POST("/", resources.PostPlayer(db))
	players.GET("/:name", resources.GetPlayer("name", db))
	players.DELETE("/:name", resources.DeletePlayer("name", db))
	players.GET("/", resources.GetPlayers(db))

	tables := router.Group("/tables/")
	tables.POST("/", resources.PostTable(db))
	tables.GET("/:id", resources.GetTable("id", db))
	//tables.DELETE("/:id", resources.DeleteTable("id", db))
	tables.GET("/", resources.GetTables(db))

	tournaments := router.Group("/tournaments/")
	tournaments.POST("/", resources.PostTournament(db))
	tournaments.GET("/", resources.GetTournaments(db))
	tournaments.GET("/:id", resources.GetTournament("id", db))
	tournaments.DELETE("/:id", resources.DeleteTournament("id", db))
	tournaments.GET("/:id/players", resources.GetTournamentPlayes("id", db))
	tournaments.POST("/:id/players", resources.PostTournamentPlayer("id", db))
	tournaments.DELETE("/:id/players/:name", resources.DeleteTournamentPlayer("id", "name", db))
	tournaments.GET("/:id/tables", resources.GetTournamentTables("id", db))
	tournaments.POST("/:id/tables", resources.PostTournamentTables("id", db))
	tournaments.DELETE("/:id/tables/:table", resources.DeleteTournamentTable("id", "table", db))
	tournaments.POST("/:id/tables/:table/games", resources.PostGame("id", "table", db))
	tournaments.GET("/:id/games", resources.GetGamesInTournament("id", db))

	//Actions
	tournaments.GET("/:id/games/random", resources.GetRandomGames("id", db))
	tournaments.GET("/:id/games/start", resources.GetGameStart("id", db))

	//Events
	tournaments.GET("/:id/events/player", resources.GetPlayerEvents("id"))
	tournaments.GET("/:id/events/game", resources.GetGameEvents("id"))

	games := router.Group("/games/")
	games.GET("/", resources.GetGames(db))
	games.GET("/:id", resources.GetGame("id", db))

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	router.GET("/client/*any", func(c *gin.Context) {
		serveStatic(c, client, "/client/", "client/build")
	})

	router.GET("/html/*any", func(c *gin.Context) {
		serveStatic(c, html, "/html/", "html")
	})

	return router, db
}

func serveStatic(c *gin.Context, f fs.FS, prefix string, dir string) {
	subfs, err := fs.Sub(f, dir)
	if err != nil {
		panic(err)
	}
	path := c.Request.URL.Path[len(prefix):len(c.Request.URL.Path)]
	c.FileFromFS(path, http.FS(subfs))
}
