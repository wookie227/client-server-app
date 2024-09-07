package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) getAllUsers(c *gin.Context) {
	// Вызов метода сервиса для получения всех пользователей
	users, err := h.services.Users.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Возвращаем список пользователей в формате JSON
	c.JSON(http.StatusOK, users)

}
