# Foosball tournament applications

[![Go CI build](https://github.com/jensborch/go-foosball/actions/workflows/go.yml/badge.svg)](https://github.com/jensborch/go-foosball/actions/workflows/go.yml)
[![JS CI build](https://github.com/jensborch/go-foosball/actions/workflows/js.yml/badge.svg)](https://github.com/jensborch/go-foosball/actions/workflows/js.yml)
[![Go Report Card](https://goreportcard.com/badge/github.com/jensborch/go-foosball)](https://goreportcard.com/report/github.com/jensborch/go-foosball)
[![codecov](https://codecov.io/gh/jensborch/go-foosball/branch/master/graph/badge.svg)](https://codecov.io/gh/jensborch/go-foosball)

Go-foosball is an application to manage your foosball tournaments. It supports multiple tournaments, and you can easily add players and tables. Each players receives a rating based on a chess like rating system (Elo).

![Screenshot](screenshot.png)

The application is using a REST service back-end written in Go and a front-end created using TypeScript and React.

## Run

Start the application on MacOS using:

```sh
./go-foosball-darwin
```

or on Linux:

```sh
./go-foosball-linux
```

or on Windows:

```bat
go-foosball.exe
```

The GUI can then be accessed using [http://localhost:8080/]

Use `--help` to list command line options - e.g.:

```sh
./go-foosball-darwin --help
```

This will output:

```txt
Usage of ./go-foosball-darwin:
  -db string
        the database file (default "foosball.db")
  -debug
        enable debug
  -port uint
        the port number (default 8080)
```

## Build

Build the back-end using:

```sh
make build
```

or

```sh
go build -o go-foosball
```

[Go](https://go.dev/) must be installed.

The front-end will be embed in the back-end executable when build using:

```sh
make client build
```

but back-end and front-end can also run separately. To only build the front-end use:

```sh
cd client
pnpm build
```

To only start the front-end use:

```sh
cd client
pnpm start
```

[Node.js](https://nodejs.org/) version 14 or above and [Yarn](https://yarnpkg.com/) must be installed.

## Test

Test the back-end using:

```sh
make test
```

or

```sh
go test -cover ./...
```

Test the front-end using:

```sh
cd client
pnpm test
```

## Swagger

```sh
make swagger
```

or

```sh
$(go env GOPATH)/bin/swag init
```

Swagger can be viewed using [http://localhost:8080/swagger/index.html]
