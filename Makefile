GOARCH = amd64

BIN = ~/go/bin

VERSION ?= DEV
COMMIT=$(shell git rev-parse HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
GOPATH=$(shell go env GOPATH)

ifneq ($(VERSION),DEV)
	export GIN_MODE := release
endif

LDFLAGS = -ldflags "-X main.VERSION=${VERSION} -X main.COMMIT=${COMMIT} -X main.BRANCH=${BRANCH}"

ifeq ($(OS),Windows_NT)
	GOOS=windows
	BINARY = go-foosball.exe
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		GOOS=linux
		BINARY = go-foosball-linux
	endif
	ifeq ($(UNAME_S),Darwin)
		GOARCH=arm64
		GOOS=darwin
		BINARY = go-foosball-darwin
	endif
endif

.PHONY: client clean

all: test vet build

swagger: 
	$(GOPATH)/bin/swag init

format: 
	$(GOPATH)/bin/swag fmt

build:
	CGO_ENABLED=1 GOOS=${GOOS} GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}

test:
	go test -cover ./...

vet:
	go vet ./...

client:
	cd client; yarn install; yarn build
	
clean:
	go clean
	go mod tidy

$(shell if [ ! -d "./client/build" ]; then mkdir -p  ./client/build; fi)
$(shell if [ ! -f "./client/build/test.html" ]; then touch  ./client/build/test.html; fi)