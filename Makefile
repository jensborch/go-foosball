BINARY = go-foosball
GOARCH = amd64

BIN = ../../../../bin

VERSION?=?
COMMIT=$(shell git rev-parse HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

LDFLAGS = -ldflags "-X main.VERSION=${VERSION} -X main.COMMIT=${COMMIT} -X main.BRANCH=${BRANCH}"

all: test vet build

deps:
	go get -u github.com/golang/dep/cmd/dep
	go get github.com/GeertJohan/go.rice
	go get github.com/GeertJohan/go.rice/rice

ensure:
	${BIN}/dep ensure

build:
	GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}
	${BIN}/rice append --exec ${BINARY}

build-linux: 
	GOOS=linux GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}
	${BIN}/rice append --exec ${BINARY}-linux-${GOARCH}

build-windows:
	GOOS=windows GOARCH=${GOARCH} go build ${LDFLAGS} -o ${BINARY}.exe
	${BIN}/rice append --exec ${BINARY}-windows-${GOARCH}.exe

test:
	go test -cover ./...

vet:
	go vet ./...
	
clean:
	go clean
	rm -f ${BINARY}-*
