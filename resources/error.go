package resources

import (
	"fmt"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// NewError creates an new error response
func NewErrorResponse(error string) *ErrorResponse {
	return &ErrorResponse{
		Error: error,
	}
}

// ErrorResponse provides an error response for the API
type ErrorResponse struct {
	Error string `json:"error" binding:"required"`
} //@name Error

// HandlePanicInTransaction provides a defer function to handle panics when a transaction has been started
func HandlePanicInTransaction(c *gin.Context, tx *gorm.DB) {
	if r := recover(); r != nil {
		switch r := r.(type) {
		case error:
			c.JSON(http.StatusInternalServerError, NewErrorResponse(r.Error()))
		default:
			c.JSON(http.StatusInternalServerError, NewErrorResponse("Unknown error"))
		}
		tx.Rollback()
		fmt.Println("Panic occurred:", r)
		debug.PrintStack()
	} else {
		tx.Commit()
	}
}

// HandlePanic provides a defer function to handle panics
func HandlePanic(c *gin.Context) {
	if r := recover(); r != nil {
		switch r := r.(type) {
		case error:
			c.JSON(http.StatusInternalServerError, NewErrorResponse(r.Error()))
		default:
			c.JSON(http.StatusInternalServerError, NewErrorResponse("Unknown error"))
		}
		fmt.Println("Panic occurred:", r)
		debug.PrintStack()
	}
}
