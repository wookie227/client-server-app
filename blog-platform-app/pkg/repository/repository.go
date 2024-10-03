package repository

import (
	models "blog-platform-app/models"

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
		Chats:         NewChatRepository(db),
	}
}
