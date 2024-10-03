package handler

import (
	models "blog-platform-app/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) signUp(c *gin.Context) {
	var input models.User

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	id, err := h.services.Authorization.CreateUser(input)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})

}

type signInResponse struct {
	Token  string `json:"token"`
	UserID int    `json:"userId"`
}

type signInInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) signIn(c *gin.Context) {
	var input signInInput

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	token, userId, err := h.services.Authorization.GenerateToken(input.Email, input.Password)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.SetCookie(
		"authToken", // Название cookie
		token,       // Значение токена
		3600,        // Время жизни в секундах (3600 секунд = 1 час)
		"/",         // Путь cookie ("/" означает, что он будет доступен на всем сайте)
		"",          // Домен (пусто - используется текущий домен)
		false,       // Secure: если true, cookie будет передаваться только по HTTPS
		false,       // HttpOnly: если true, запрещает доступ к cookie через JavaScript //TODO работа с httpOnlyCookie
	)

	c.JSON(http.StatusOK, signInResponse{
		Token:  token,
		UserID: userId,
	})
}

func (h *Handler) logout(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "authToken",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}
