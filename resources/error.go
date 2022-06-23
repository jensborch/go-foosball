package resources

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
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

//HandlePanicInTransaction provides a defer function to handle panics when a transaction has been started
func HandlePanicInTransaction(c *gin.Context, tx *gorm.DB) {
	if r := recover(); r != nil {
		switch r := r.(type) {
		case error:
			c.JSON(http.StatusInternalServerError, NewErrorResponse(r.Error()))
		default:
			c.JSON(http.StatusInternalServerError, NewErrorResponse("Unknown error"))
		}
		tx.Rollback()
	} else {
		tx.Commit()
	}
}

//HandlePanic provides a defer function to handle panics
func HandlePanic(c *gin.Context) {
	if r := recover(); r != nil {
		switch r := r.(type) {
		case error:
			c.JSON(http.StatusInternalServerError, NewErrorResponse(r.Error()))
		default:
			c.JSON(http.StatusInternalServerError, NewErrorResponse("Unknown error"))
		}
	}
}

//ShouldBindAndValidate checks if interface is valid and then returns true
func ShouldBindAndValidate(i interface{}, c *gin.Context) bool {
	ok := true
	if err := c.ShouldBindJSON(i); err == nil {
		validate := validator.New()
		if err := validate.Struct(i); err != nil {
			ok = false
			c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
		}
	} else {
		ok = false
		c.JSON(http.StatusBadRequest, NewErrorResponse(err.Error()))
	}
	return ok
}
