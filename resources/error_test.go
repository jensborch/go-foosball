package resources

import (
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func testDefer(c *gin.Context) {
	defer HandlePanic(c)
	panic("test")
}

func TestHandlePanic(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	testDefer(c)
	if w.Result().StatusCode != 500 {
		t.Errorf("Panic should result in HTTP 500, got: %d.", w.Result().StatusCode)
	}
}
