package handler

import (
	models "blog-platform-app/Models"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) handleFileUpload(c *gin.Context) (string, string) {
	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		return "", "Failed to upload image"
	}
	defer file.Close()

	uploadDir := "./uploads"
	filePath := fmt.Sprintf("%s/%s", uploadDir, fileHeader.Filename)

	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		if err := os.Mkdir(uploadDir, os.ModePerm); err != nil {
			return "", "Failed to create upload directory"
		}
	}

	out, err := os.Create(filePath)
	if err != nil {
		return "", "Failed to save image"
	}
	defer out.Close()

	if _, err = io.Copy(out, file); err != nil {
		return "", "Failed to save image"
	}

	return "/uploads/" + fileHeader.Filename, ""
}

// Обработчик создания новости
func (h *Handler) createNew(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token not provided"})
		return
	}

	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	userID, err := h.services.Authorization.ParseToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	// Получаем текстовые данные
	title := c.PostForm("title")
	text := c.PostForm("text")

	if title == "" || text == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title and text are required"})
		return
	}

	// Загружаем изображение, если оно присутствует
	imageURL := ""
	if file, _, err := c.Request.FormFile("file"); err == nil {
		imageURL, _ = h.handleFileUpload(c)
		file.Close()
	}

	// Создание новости
	news := models.News{
		UserID:   uint(userID),
		Title:    title,
		Text:     text,
		ImageURL: imageURL,
		Date:     time.Now(),
	}

	createdNews, err := h.services.News.Create(news)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create news"})
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
