BIN = ~/go/bin

VERSION ?= DEV
COMMIT=$(shell git rev-parse HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
GOPATH=$(shell go env GOPATH)

LDFLAGS = -ldflags "-X main.VERSION=${VERSION} -X main.COMMIT=${COMMIT} -X main.BRANCH=${BRANCH}"
ARCH_OPT = CGO_ENABLED=0

ifeq ($(OS),Windows_NT)
	BINARY = go-foosball.exe
	ARCH_OPT := ${ARCH_OPT} GOOS=windows
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		ARCH_OPT := ${ARCH_OPT} GOOS=linux
		BINARY = go-foosball-linux
	endif
	ifeq ($(UNAME_S),Darwin)
		ARCH_OPT := ${ARCH_OPT} GOOS=darwin
		BINARY = go-foosball-darwin
	endif
	ifneq ($(strip $(GOARCH)),)
		ARCH_OPT := ${ARCH_OPT} GOARCH=${GOARCH} 
		BINARY := ${BINARY}-${GOARCH}
	endif
	ifneq ($(strip $(GOARM)),) 
		ARCH_OPT := ${ARCH_OPT} GOARM=${GOARM}
	endif
endif

.PHONY: client clean

all: test vet build

swagger: 
	$(GOPATH)/bin/swag init

format: 
	$(GOPATH)/bin/swag fmt

build:
	${ARCH_OPT} go build ${LDFLAGS} -o ${BINARY}

test:
	go test -cover ./...

vet:
	go vet ./...

client:
	cd client; pnpm install; pnpm build
	
clean:
	go clean
	go mod tidy

$(shell if [ ! -d "./client/build" ]; then mkdir -p  ./client/build; fi)
$(shell if [ ! -f "./client/build/test.html" ]; then touch  ./client/build/test.html; fi)