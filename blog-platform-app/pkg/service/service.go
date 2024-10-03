package service

import (
	models "blog-platform-app/models"
	"blog-platform-app/pkg/repository"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GenerateToken(email, password string) (string, int, error)
	ParseToken(token string) (int, error)
}

type Users interface {
	GetAll() ([]models.User, error)
}

type News interface {
	GetAll() ([]models.NewsDTO, error)
	Create(news models.News) (*models.News, error)
	Delete(id int) error
	Update(news models.News) (*models.News, error)
}

type Chats interface {
	CreateChat(chat models.Chat) (uint, error)
	GetAllChats() ([]models.Chat, error)
	GetChatByID(chatID uint) (models.Chat, error)
	UpdateChat(chatID uint, input models.Chat) error
	DeleteChat(chatID uint) error
	GetMessagesByChatID(chatID uint) ([]models.Message, error)
	CreateMessage(message models.Message) (uint, error)
	GetMessageByID(messageID uint) (models.Message, error)
	UpdateMessage(messageID uint, input models.Message) error
	DeleteMessage(messageID uint) error
}

type ChatMembers interface {
	GetAll() ([]models.ChatMember, error)
}

type Messages interface {
	GetAll() ([]models.Message, error)
}

type Service struct {
	Authorization
	News
	Users
	Chats
	ChatMembers
	Messages
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
		Users:         NewUsersListService(repos.Users),
		News:          NewNewsListService(repos.News),
		Chats:         NewChatService(repos.Chats),
	}
}
