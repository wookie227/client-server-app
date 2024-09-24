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
	GetAll() ([]models.NewsDTO, error)
	Create(news models.News) (*models.News, error)
	Delete(id int) error
	Update(news models.News) (*models.News, error)
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
		News:          NewNewsListPostgres(db),
	}
}
