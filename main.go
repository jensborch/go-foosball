package main

import (
	"embed"
	"flag"
	"fmt"
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
	"github.com/jensborch/go-foosball/router"

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
	engine, err := setupServer(dbfile, debug)
	if err != nil {
		log.Fatalf("Failed to set up server: %v", err)
	}
	engine.Run(":" + strconv.FormatUint(uint64(port), 10))
}

func corsHandler() gin.HandlerFunc {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	return cors.New(config)
}

func setupServer(dbfile string, debug bool) (*gin.Engine, error) {
	var gormlog logger.Interface
	if !debug {
		gin.SetMode(gin.ReleaseMode)
		gormlog = logger.Default.LogMode(logger.Warn)
	} else {
		gormlog = logger.Default.LogMode(logger.Info)
	}

	engine := gin.Default()
	engine.Use(corsHandler())

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("gamewinner", resources.GameWinnerValidator)
	} else {
		return nil, fmt.Errorf("failed to add validator")
	}

	db, err := gorm.Open(sqlite.Open(dbfile), &gorm.Config{
		Logger: gormlog,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
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

	// Setup API routes
	router.SetupAPIRoutes(engine, db)

	// Setup static files and other routes
	setupStaticRoutes(engine)

	return engine, nil
}

func setupStaticRoutes(engine *gin.Engine) {
	const avatars = "./avatars"
	if _, err := os.Stat(avatars); os.IsNotExist(err) {
		if err := os.Mkdir(avatars, 0755); err != nil {
			log.Printf("Warning: unable to create avatars folder: %v", err)
		}
	}
	engine.Static("/avatars", avatars)

	engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	engine.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/client")
	})

	subfs := subFs(client, "/client/", "client/dist")
	engine.GET("/client/*any", func(c *gin.Context) {
		serveStatic(c, subfs, "/client/")
	})
}

func serveStatic(c *gin.Context, f fs.FS, prefix string) {
	p := c.Request.URL.Path[len(prefix):]
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
