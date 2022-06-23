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
	ID        uint           `json:"id" binding:"required" gorm:"primary_key"`
	CreatedAt time.Time      `json:"created" binding:"required" gorm:"not null"`
	UpdatedAt time.Time      `json:"updated" binding:"required" gorm:"not null"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (g *Base) IdAsString() string {
	return strconv.FormatUint(uint64(g.ID), 10)
}
