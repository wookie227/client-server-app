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

	hub := newHub()
	go hub.run()

	router.GET("/ws", func(c *gin.Context) {
		hub.handleConnections(c)
	})
	auth := router.Group("/auth")
	{
		auth.POST("/sign-up", h.signUp)
		auth.POST("/sign-in", h.signIn)
		auth.POST("/logout", h.logout)
	}

	api := router.Group("/api", h.userIdentity) //
	api.POST("/upload")
	router.Static("/uploads", "./uploads")
	{
		users := api.Group("/users")
		{
			users.GET("/", h.getAllUsers)
		}

		news := api.Group("/news")
		{
			news.POST("/", h.createNew)
			news.GET("/", h.getAllNews)
			news.GET("/:id", h.getNewByTitle)
			news.PUT("/:id", h.updateNew)
			news.DELETE("/:id", h.deleteNew)
		}

		chats := api.Group("/chats", h.userIdentity)
		{
			chats.POST("/", h.createChat)
			chats.GET("/", h.getAllChats)
			chats.GET("/:chat_id", h.getChatById)
			chats.PUT("/:chat_id", h.updateChat)
			chats.DELETE("/:chat_id", h.deleteChat)
		}

		chatMembers := chats.Group("/:chat_id/members", h.userIdentity)
		{
			chatMembers.POST("/", h.createChatMember)
			chatMembers.GET("/", h.getAllChatMembers)
			chatMembers.GET("/:chat_member_id", h.getChatMemberById)
			chatMembers.PUT("/:chat_member_id", h.updateChatMember)
			chatMembers.DELETE("/:chat_member_id", h.deleteChatMember)
		}

		messages := chats.Group("/:chat_id/messages", h.userIdentity)
		{
			messages.POST("/", h.createMessage)              // Создать новое сообщение
			messages.GET("/", h.getMessagesByChatID)         // Получить все сообщения для конкретного чата
			messages.GET("/:message_id", h.getMessageById)   // Получить конкретное сообщение по ID
			messages.PUT("/:message_id", h.updateMessage)    // Обновить конкретное сообщение
			messages.DELETE("/:message_id", h.deleteMessage) // Удалить конкретное сообщение
		}
	}

	return router
}
