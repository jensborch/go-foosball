package resources

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/glebarez/sqlite"
)

func TestErrorHandlerMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("handles HTTPError correctly", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, router := gin.CreateTestContext(w)
		router.Use(ErrorHandlerMiddleware())
		router.GET("/test", func(c *gin.Context) {
			Abort(c, NotFoundError("test item not found"))
		})

		c.Request = httptest.NewRequest("GET", "/test", nil)
		router.ServeHTTP(w, c.Request)

		if w.Result().StatusCode != http.StatusNotFound {
			t.Errorf("Expected HTTP 404, got: %d", w.Result().StatusCode)
		}
	})

	t.Run("passes through successful responses", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, router := gin.CreateTestContext(w)
		router.Use(ErrorHandlerMiddleware())
		router.GET("/test", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})

		c.Request = httptest.NewRequest("GET", "/test", nil)
		router.ServeHTTP(w, c.Request)

		if w.Result().StatusCode != http.StatusOK {
			t.Errorf("Expected HTTP 200, got: %d", w.Result().StatusCode)
		}
	})

	t.Run("handles BadRequestError correctly", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, router := gin.CreateTestContext(w)
		router.Use(ErrorHandlerMiddleware())
		router.GET("/test", func(c *gin.Context) {
			Abort(c, BadRequestError("invalid input"))
		})

		c.Request = httptest.NewRequest("GET", "/test", nil)
		router.ServeHTTP(w, c.Request)

		if w.Result().StatusCode != http.StatusBadRequest {
			t.Errorf("Expected HTTP 400, got: %d", w.Result().StatusCode)
		}
	})
}
