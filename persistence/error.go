package persistence

import (
	"errors"

	"github.com/jensborch/go-foosball/model"
	"gorm.io/gorm"
)

// HasBeenFound returns false if error is a gorm.ErrRecordNotFound error
func HasBeenFound(err error) model.Found {
	if err == nil {
		return true
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		return false
	} else {
		panic(err)
	}
}
