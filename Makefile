GOARCH = amd64

BIN = ~/go/bin

VERSION=0.8.1
COMMIT=$(shell git rev-parse HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

LDFLAGS = -ldflags "-X main.VERSION=${VERSION} -X main.COMMIT=${COMMIT} -X main.BRANCH=${BRANCH}"

ifeq ($(OS),Windows_NT)
	BINARY = go-foosball.exe
else
	BINARY = go-foosball
endif

all: test vet build

build:
	go build ${LDFLAGS} -o ${BINARY}

build-linux: 
	GOOS=linux GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}

build-windows:
	GOOS=windows GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}.exe

test:
	go test -cover ./...

vet:
	go vet ./...
	
clean:
	go clean