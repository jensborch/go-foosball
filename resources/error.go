package resources

// NewError create error response
func NewErrorResponse(error string) *ErrorResponse {
	return &ErrorResponse{
		Error: error,
	}
}

// Error provides a error response
type ErrorResponse struct {
	Error string `json:"error"`
}
