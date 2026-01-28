package resources

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// NewErrorResponse creates a new error response
func NewErrorResponse(error string) *ErrorResponse {
	return &ErrorResponse{
		Error: error,
	}
}

// ErrorResponse provides an error response for the API
type ErrorResponse struct {
	Error string `json:"error" binding:"required"`
} //@name Error

// HTTPError represents an error with an associated HTTP status code
type HTTPError struct {
	Status  int
	Message string
}

func (e *HTTPError) Error() string {
	return e.Message
}

// NotFoundError creates a 404 error
func NotFoundError(format string, args ...interface{}) *HTTPError {
	return &HTTPError{Status: http.StatusNotFound, Message: fmt.Sprintf(format, args...)}
}

// BadRequestError creates a 400 error
func BadRequestError(format string, args ...interface{}) *HTTPError {
	return &HTTPError{Status: http.StatusBadRequest, Message: fmt.Sprintf(format, args...)}
}

// ConflictError creates a 409 error
func ConflictError(format string, args ...interface{}) *HTTPError {
	return &HTTPError{Status: http.StatusConflict, Message: fmt.Sprintf(format, args...)}
}

// Abort adds an HTTPError to context and aborts the request
func Abort(c *gin.Context, err *HTTPError) {
	_ = c.Error(err)
	c.Abort()
}
