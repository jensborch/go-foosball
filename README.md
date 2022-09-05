# Foosball tournament applications

[![Go CI build](https://github.com/jensborch/go-foosball/actions/workflows/go.yml/badge.svg)](https://github.com/jensborch/go-foosball/actions/workflows/go.yml)
[![JS CI build](https://github.com/jensborch/go-foosball/actions/workflows/js.yml/badge.svg)](https://github.com/jensborch/go-foosball/actions/workflows/js.yml)
[![Go Report Card](https://goreportcard.com/badge/github.com/jensborch/go-foosball)](https://goreportcard.com/report/github.com/jensborch/go-foosball)
[![codecov](https://codecov.io/gh/jensborch/go-foosball/branch/master/graph/badge.svg)](https://codecov.io/gh/jensborch/go-foosball)

Go-foosball is an application to manage your foosball tournaments. It supports multiple tournaments, and you can easily add players and tables. Each players receives a rating based on a chess like rating system (Elo).


![Screenshot](screenshot.png)

The application is using a REST service back-end written in Go and a front-end created written TypeScript and React.

## Build

```sh
make build
```

or

```sh
go build -o go-foosball
```

## Test

```sh
make test
```

or

```sh
go test -cover ./...
```

## Run

```sh
./go-foosball
```

## Swagger

```sh
make swagger
```

or

```sh
$(go env GOPATH)/bin/swag init
```

Swagger can be viewed using: 

http://localhost:8080/swagger/index.html