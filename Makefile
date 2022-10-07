GOARCH = amd64

BIN = ~/go/bin

VERSION ?= DEV
COMMIT=$(shell git rev-parse HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
GOPATH=$(shell go env GOPATH)

LDFLAGS = -ldflags "-X main.VERSION=${VERSION} -X main.COMMIT=${COMMIT} -X main.BRANCH=${BRANCH}"

ifeq ($(OS),Windows_NT)
	BINARY = go-foosball.exe
else
	BINARY = go-foosball
endif

.PHONY: client clean

all: test vet build

swagger: 
	$(GOPATH)/bin/swag init

format: 
	$(GOPATH)/bin/swag fmt

build:
	go build ${LDFLAGS} -o ${BINARY}

build-linux:
	GOOS=linux GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}-linux

build-windows:
	GOOS=windows GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}

build-darwin-arm:
	GOOS=darwin GOARCH=arm64 go build ${LDFLAGS} -o ${BINARY}-darwin-arm

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