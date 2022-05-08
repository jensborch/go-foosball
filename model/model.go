package model

import (
	"strconv"
	"time"

	"gorm.io/gorm"
)

// Found indicating if entity is found in repository
type Found = bool

// Base is a gorm model replacment with json tags
type Base struct {
	ID        uint           `json:"id" gorm:"primary_key"`
	CreatedAt time.Time      `json:"created"`
	UpdatedAt time.Time      `json:"updated"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (g *Base) IdAsString() string {
	return strconv.FormatUint(uint64(g.ID), 10)
}

func StringToUint(str string) uint {
	if result, err := strconv.ParseInt(str, 10, 32); err != nil {
		panic(err)
	} else {
		return uint(result)
	}
}
