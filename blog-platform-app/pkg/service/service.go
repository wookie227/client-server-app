package service

import (
	models "blog-platform-app/Models"
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
}

type Chats interface {
	GetAll() ([]models.Chat, error)
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
	}
}
