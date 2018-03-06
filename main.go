package main

import (
	"flag"
	"net/http"
	"strconv"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jensborch/go-foosball/model"
	"github.com/jensborch/go-foosball/resources"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	var (
		port   uint
		dbfile string
	)
	flag.UintVar(&port, "port", 8080, "the port number")
	flag.StringVar(&dbfile, "db", "foosball.db", "the database file")
	flag.Parse()

	router := gin.Default()
	router.Use(cors.Default())

	db, err := gorm.Open("sqlite3", dbfile)
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	db.AutoMigrate(&model.Tournament{}, &model.TournamentTable{}, &model.Table{}, &model.Player{}, &model.TournamentPlayer{}, &model.Game{})

	players := router.Group("/players/")
	{
		players.POST("/", resources.PostPlayer(db))
		players.GET("/:name", resources.GetPlayer("name", db))
		//players.DELETE("/:name", resources.DeletePlayer("name", db))
		players.GET("/", resources.GetPlayers(db))
	}

	tables := router.Group("/tables/")
	{
		tables.POST("/", resources.PostTable(db))
		tables.GET("/:id", resources.GetTable("id", db))
		//tables.DELETE("/:id", resources.DeleteTable("id", db))
		tables.GET("/", resources.GetTables(db))
	}

	tournaments := router.Group("/tournaments/")
	{
		tournaments.POST("/", resources.PostTournament(db))
		tournaments.GET("/", resources.GetTournaments(db))
		tournaments.GET("/:id", resources.GetTournament("id", db))
		//tournaments.DELETE("/:id", resources.DeleteTournament("id", db))
		tournaments.GET("/:id/players", resources.GetTournamentPlayes("id", db))
		tournaments.POST("/:id/players", resources.PostTournamentPlayer("id", db))
		tournaments.DELETE("/:id/players/:name", resources.DeleteTournamentPlayer("id", "name", db))
		tournaments.GET("/:id/tables", resources.GetTournamentTables("id", db))
		tournaments.POST("/:id/tables", resources.PostTournamentTables("id", db))
		//tournaments.DELETE("/:tournament/tables/:table", resources.DeleteTournamentTable("tournament", "table", db))
		tournaments.POST("/:id/tables/:table/games", resources.PostGame("id", "table", db))
		tournaments.GET("/:id/events", resources.GetTournamentEvents("id"))
		tournaments.GET("/:id/games", resources.GetGamesInTournament("id", db))
		//tournaments.POST("/:id/games", resources.PostGameStart())
		tournaments.GET("/:id/games/random", resources.GetRandomGames("id", db))
	}

	games := router.Group("/games/")
	{
		games.GET("/", resources.GetGames(db))
		games.GET("/:id", resources.GetGame("id", db))
	}

	if i, err := rice.MustFindBox("html").String("index.html"); err == nil {
		router.GET("/", func(c *gin.Context) {
			c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(i))
		})
	}

	router.Run(":" + strconv.FormatUint(uint64(port), 10))
}
