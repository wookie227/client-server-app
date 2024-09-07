package repository

import (
	models "blog-platform-app/Models"

	"github.com/jmoiron/sqlx"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GetUser(email, password string) (models.User, error)
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

type Repository struct {
	Authorization
	News
	Users
	Chats
	ChatMembers
	Messages
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(db),
		Users:         NewUsersListPostgres(db),
	}
}
