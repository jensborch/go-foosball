GOARCH = amd64

BIN = ~/go/bin

VERSION=0.8.0
COMMIT=$(shell git rev-parse HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

LDFLAGS = -ldflags "-X main.VERSION=${VERSION} -X main.COMMIT=${COMMIT} -X main.BRANCH=${BRANCH}"

ifeq ($(OS),Windows_NT)
	BINARY = go-foosball.exe
else
	BINARY = go-foosball
endif

all: test vet build

deps:
	go get github.com/GeertJohan/go.rice
	go get github.com/GeertJohan/go.rice/rice

build:
	go build ${LDFLAGS} -o ${BINARY}
	${BIN}/rice append --exec ${BINARY}

build-linux: 
	GOOS=linux GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}
	${BIN}/rice append --exec ${BINARY}

build-windows:
	GOOS=windows GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}.exe
	${BIN}/rice append --exec ${BINARY}.exe

test:
	go test -cover ./...

vet:
	go vet ./...
	
clean:
	go clean