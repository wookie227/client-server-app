package handler

import (
	"blog-platform-app/pkg/service"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	services *service.Service
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{services: services}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	auth := router.Group("/auth")
	{
		auth.POST("/sign-up", h.signUp)
		auth.POST("/sign-in", h.signIn)
	}

	api := router.Group("/api")
	{
		news := api.Group("/news")
		{
			news.POST("/", h.createNew)
			news.GET("/", h.getAllNews)
			news.GET("/:id", h.getNewById)
			news.PUT("/:id", h.updateNew)
			news.DELETE("/:id", h.deleteNew)
		}

		chats := api.Group("/chats")
		{
			chats.POST("/", h.createChat)
			chats.GET("/", h.getAllChats)
			chats.GET("/:chat_id", h.getChatById)
			chats.PUT("/:chat_id", h.updateChat)
			chats.DELETE("/:chat_id", h.deleteChat)
		}

		chatMembers := chats.Group("/chat-members")
		{
			chatMembers.POST("/", h.createChatMember)
			chatMembers.GET("/", h.getAllChatMembers)
			chatMembers.GET("/:chat_member_id", h.getChatMemberById)
			chatMembers.PUT("/:chat_member_id", h.updateChatMember)
			chatMembers.DELETE("/:chat_member_id", h.deleteChatMember)
		}

		messages := chats.Group("/messages")
		{
			messages.POST("/", h.createMessage)
			messages.GET("/", h.getAllMessages)
			messages.GET("/:message_id", h.getMessageById)
			messages.PUT("/:message_id", h.updateMessage)
			messages.DELETE("/:message_id", h.deleteMessage)
		}
	}

	return router
}
