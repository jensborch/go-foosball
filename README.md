# Foosball REST service

[![Build Status](https://travis-ci.org/jensborch/go-foosball.svg?branch=master)](https://travis-ci.org/jensborch/go-foosball) 
[![Go Report Card](https://goreportcard.com/badge/github.com/jensborch/go-foosball)](https://goreportcard.com/report/github.com/jensborch/go-foosball)
[![codecov](https://codecov.io/gh/jensborch/go-foosball/branch/master/graph/badge.svg)](https://codecov.io/gh/jensborch/go-foosball)

Foosball tournament REST service written in Go.

# Build

```
go get -u github.com/golang/dep/cmd/dep
cd src/github.com/jensborch/go-foosball
dep ensure
go install
```

# Test

```
go test -cover github.com/jensborch/go-foosball/model
go test -cover github.com/jensborch/go-foosball/persistence
```

# Run

```
./bin/go-foosball
```

