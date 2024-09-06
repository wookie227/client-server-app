package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) createNew(c *gin.Context) {
	id, _ := c.Get(userCtx)
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

func (h *Handler) getAllNews(c *gin.Context) {

}

func (h *Handler) getNewById(c *gin.Context) {

}

func (h *Handler) updateNew(c *gin.Context) {

}

func (h *Handler) deleteNew(c *gin.Context) {

}
