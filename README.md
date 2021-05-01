# Foosball REST service

[![Build Status](https://travis-ci.org/jensborch/go-foosball.svg?branch=master)](https://travis-ci.org/jensborch/go-foosball) 
[![Go Report Card](https://goreportcard.com/badge/github.com/jensborch/go-foosball)](https://goreportcard.com/report/github.com/jensborch/go-foosball)
[![codecov](https://codecov.io/gh/jensborch/go-foosball/branch/master/graph/badge.svg)](https://codecov.io/gh/jensborch/go-foosball)

Foosball tournament REST service written in Go.

## Build

```sh
make deps build
```

or

```sh
go get github.com/GeertJohan/go.rice
go get github.com/GeertJohan/go.rice/rice
go build -o go-foosball
rice append --exec go-foosball
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
