package main

import (
	"fmt"

	"github.com/jensborch/go-foosball/model"
)

func main() {
	g := model.NewSinglesGame()
	fmt.Println(g)
}
