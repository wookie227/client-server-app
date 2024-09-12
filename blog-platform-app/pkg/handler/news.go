package handler

import (
	models "blog-platform-app/Models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) createNew(c *gin.Context) {
	var news models.News

	// Проверка и вывод ошибки при неправильном вводе данных
	if err := c.BindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	if news.Date.IsZero() {
		news.Date = time.Now()
	}

	// Создание новости
	createdNews, err := h.services.News.Create(news)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create news", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, createdNews)
}

func (h *Handler) getAllNews(c *gin.Context) {
	news, err := h.services.News.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, news)
}

func (h *Handler) getNewByTitle(c *gin.Context) {

}

func (h *Handler) updateNew(c *gin.Context) {

}

func (h *Handler) deleteNew(c *gin.Context) {

}
