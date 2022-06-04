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
	ID        uint           `json:"id" validate:"required" gorm:"primary_key"`
	CreatedAt time.Time      `json:"created" validate:"required" gorm:"not null"`
	UpdatedAt time.Time      `json:"updated" validate:"required" gorm:"not null"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (g *Base) IdAsString() string {
	return strconv.FormatUint(uint64(g.ID), 10)
}
