package model

import "time"

// Found indicating if entity is found in repository
type Found = bool

// Base is a gorm model replacment with json tags
type Base struct {
	ID        uint       `json:"-" gorm:"primary_key"`
	CreatedAt time.Time  `json:"created"`
	UpdatedAt time.Time  `json:"updated"`
	DeletedAt *time.Time `json:"-" sql:"index"`
}
