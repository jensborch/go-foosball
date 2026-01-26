package main

import (
	"embed"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"

	_ "github.com/jensborch/go-foosball/docs"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/resources"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// @title        Go-foosball API
// @version      0.8
// @description  Foosball tournament REST service.

// @BasePath  /api

// React client static web server content.
//
//go:embed client/dist
var client embed.FS

func main() {
	var (
		port   uint
		dbfile string
		debug  bool
	)
	flag.UintVar(&port, "port", 8080, "the port number")
	flag.StringVar(&dbfile, "db", "foosball.db", "the database file")
	flag.BoolVar(&debug, "debug", false, "enable debug")
	flag.Parse()
	log.Printf("Starting go-foosball on port %d using database %s", port, dbfile)
	engine, _ := setupServer(dbfile, debug)
	engine.Run(":" + strconv.FormatUint(uint64(port), 10))
}

func corsHandler() gin.HandlerFunc {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	return cors.New(config)
}

func setupServer(dbfile string, debug bool) (*gin.Engine, *gorm.DB) {
	var gormlog logger.Interface
	if !debug {
		gin.SetMode(gin.ReleaseMode)
		gormlog = logger.Default.LogMode(logger.Warn)
	} else {
		gormlog = logger.Default.LogMode(logger.Info)
	}

	router := gin.Default()
	router.Use(corsHandler())

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("gamewinner", resources.GameWinnerValidator)
	} else {
		panic("failed to add validator")
	}

	db, err := gorm.Open(sqlite.Open(dbfile), &gorm.Config{
		Logger: gormlog,
	})
	if err != nil {
		panic("failed to connect database")
	}
	sqliteDb, _ := db.DB()
	sqliteDb.SetMaxOpenConns(1)

	db.AutoMigrate(&model.Tournament{},
		&model.TournamentTable{},
		&model.Table{},
		&model.Player{},
		&model.TournamentPlayer{},
		&model.Game{},
		&model.TournamentPlayerHistory{})

	api := router.Group("/api")

	players := api.Group("/players")
	players.GET("", resources.GetPlayers(db))
	players.POST("", resources.PostPlayer(db))
	players.POST("/", resources.PostPlayer(db))
	players.GET("/:name", resources.GetPlayer("name", db))
	players.DELETE("/:name", resources.DeletePlayer("name", db))

	tables := api.Group("/tables")
	tables.GET("", resources.GetTables(db))
	tables.POST("", resources.PostTable(db))
	tables.POST("/", resources.PostTable(db))
	tables.GET("/:id", resources.GetTable("id", db))
	//tables.DELETE("/:id", resources.DeleteTable("id", db))

	tournaments := api.Group("/tournaments")
	tournaments.GET("", resources.GetTournaments(db))
	tournaments.POST("", resources.PostTournament(db))
	tournaments.POST("/", resources.PostTournament(db))
	tournaments.GET("/:id", resources.GetTournament("id", db))
	tournaments.DELETE("/:id", resources.DeleteTournament("id", db))

	tournaments.GET("/:id/players", resources.GetTournamentPlayes("id", db))
	tournaments.POST("/:id/players", resources.PostTournamentPlayer("id", db))
	tournaments.PUT("/:id/players/:name", resources.UpdateTournamentPlayerStatus("id", "name", db))
	tournaments.DELETE("/:id/players", resources.DeleteAllTournamentPlayers("id", db))
	//tournaments.GET("/:id/players/:name", resources.GetTournamentPlayer("id", "name", db))
	tournaments.GET("/:id/players/:name/history", resources.GetTournamentPlayeHistory("id", "name", db))
	tournaments.GET("/:id/history", resources.GetTournamentHistory("id", db))

	tournaments.GET("/:id/tables", resources.GetTournamentTables("id", db))
	tournaments.POST("/:id/tables", resources.PostTournamentTables("id", db))
	tournaments.POST("/:id/tables/", resources.PostTournamentTables("id", db))
	tournaments.DELETE("/:id/tables/:table", resources.DeleteTournamentTable("id", "table", db))
	tournaments.POST("/:id/tables/:table/games", resources.PostGame("id", "table", db))
	tournaments.POST("/:id/tables/:table/games/", resources.PostGame("id", "table", db))
	tournaments.GET("/:id/games", resources.GetGamesInTournament("id", db))

	//Actions
	tournaments.GET("/:id/games/random", resources.GetRandomGames("id", db))
	tournaments.GET("/:id/games/start", resources.GetGameStart("id", db))

	//Events
	tournaments.GET("/:id/events/player", resources.GetPlayerEvents("id"))
	tournaments.GET("/:id/events/game", resources.GetGameEvents("id"))

	games := api.Group("/games")
	games.GET("", resources.GetGames(db))
	games.GET("/:id", resources.GetGame("id", db))

	const avatars = "./avatars"
	_, err = os.Stat(avatars)
	if os.IsNotExist(err) {
		err = os.Mkdir(avatars, 0755)
		if err != nil {
			panic("unable to create avatars foler")
		}
	}
	router.Static("/avatars", avatars)

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	router.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/client")
	})

	subfs := subFs(client, "/client/", "client/dist")
	router.GET("/client/*any", func(c *gin.Context) {
		serveStatic(c, subfs, "/client/")
	})
	return router, db
}

func serveStatic(c *gin.Context, f fs.FS, prefix string) {
	p := c.Request.URL.Path[len(prefix):len(c.Request.URL.Path)]
	if _, error := f.Open(p); error == nil {
		c.FileFromFS(p, http.FS(f))
	} else {
		c.FileFromFS("/", http.FS(f))
	}
}

func subFs(f fs.FS, prefix string, dir string) fs.FS {
	subfs, err := fs.Sub(f, dir)
	if err != nil {
		panic(err)
	}
	return subfs
}
