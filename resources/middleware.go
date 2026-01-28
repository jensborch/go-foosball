package resources

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ErrorHandlerMiddleware processes errors added via c.Error() and returns consistent JSON responses.
// It checks if a response has already been written (e.g., by gin.Recovery()) to avoid double writes.
func ErrorHandlerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Skip if response already written (e.g., by gin.Recovery() after panic)
		if c.Writer.Written() {
			return
		}

		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err
			if httpErr, ok := err.(*HTTPError); ok {
				c.JSON(httpErr.Status, NewErrorResponse(httpErr.Message))
			} else {
				c.JSON(http.StatusInternalServerError, NewErrorResponse(err.Error()))
			}
		}
	}
}

// TransactionMiddleware wraps handlers with database transaction management.
// For write operations (POST, PUT, DELETE, PATCH), it creates a transaction
// that is automatically committed on success or rolled back on errors.
// For read operations (GET, HEAD, OPTIONS), it provides direct database access.
//
// Use GetDB(c) in handlers to retrieve the appropriate database connection.
func TransactionMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip transaction for read operations
		if c.Request.Method == "GET" || c.Request.Method == "HEAD" || c.Request.Method == "OPTIONS" {
			c.Set("db", db)
			c.Next()
			return
		}

		tx := db.Begin()
		c.Set("db", tx)

		c.Next()

		if len(c.Errors) > 0 || c.Writer.Status() >= 400 || c.IsAborted() {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}
}

// GetDB retrieves the database connection from context.
// Returns a transaction for write operations, or the connection pool for reads.
// All handlers should use this method to access the database.
func GetDB(c *gin.Context) *gorm.DB {
	if db, exists := c.Get("db"); exists {
		return db.(*gorm.DB)
	}
	return nil
}
