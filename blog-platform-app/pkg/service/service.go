package service

import (
	models "blog-platform-app/Models"
	"blog-platform-app/pkg/repository"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GenerateToken(email, password string) (string, error)
	ParseToken(token string) (int, error)
}

type Users interface {
	GetAll() ([]models.User, error)
}

type News interface {
}

type Chats interface {
}

type ChatMembers interface {
}

type Messages interface {
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
	}
}
