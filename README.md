# Foosball REST service

[![Go CI build](https://github.com/jensborch/go-foosball/actions/workflows/go.yml/badge.svg)](https://github.com/jensborch/go-foosball/actions/workflows/go.yml)
[![JS CI build](https://github.com/jensborch/go-foosball/actions/workflows/js.yml/badge.svg)](https://github.com/jensborch/go-foosball/actions/workflows/js.yml)
[![Go Report Card](https://goreportcard.com/badge/github.com/jensborch/go-foosball)](https://goreportcard.com/report/github.com/jensborch/go-foosball)
[![codecov](https://codecov.io/gh/jensborch/go-foosball/branch/master/graph/badge.svg)](https://codecov.io/gh/jensborch/go-foosball)

Foosball tournament REST service written in Go.

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