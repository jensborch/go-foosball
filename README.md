# Foosball REST service

[![Build Status](https://travis-ci.org/jensborch/go-foosball.svg?branch=master)](https://travis-ci.org/jensborch/go-foosball) 
[![Go Report Card](https://goreportcard.com/badge/github.com/jensborch/go-foosball)](https://goreportcard.com/report/github.com/jensborch/go-foosball)
[![codecov](https://codecov.io/gh/jensborch/go-foosball/branch/master/graph/badge.svg)](https://codecov.io/gh/jensborch/go-foosball)

Foosball tournament REST service written in Go.

# Build

```
go get -u github.com/golang/dep/cmd/dep
go get github.com/GeertJohan/go.rice
go get github.com/GeertJohan/go.rice/rice
cd src/github.com/jensborch/go-foosball
dep ensure
go build -o go-foosball
rice append --exec go-foosball
```

# Test

```
go test -cover github.com/jensborch/go-foosball/model
go test -cover github.com/jensborch/go-foosball/persistence
```

# Run

```
go-foosball
```

