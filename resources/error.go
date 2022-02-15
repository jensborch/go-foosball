package resources

// NewError creates an new error response
func NewErrorResponse(error string) *ErrorResponse {
	return &ErrorResponse{
		Error: error,
	}
}

// ErrorResponse provides an error response for the API
type ErrorResponse struct {
	Error string `json:"error"`
}
