package repository

import (
	models "blog-platform-app/models"

	"github.com/jmoiron/sqlx"
)

type Chat interface {
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

type chatRepository struct {
	db *sqlx.DB
}

func NewChatRepository(db *sqlx.DB) *chatRepository {
	return &chatRepository{db: db}
}

func (r *chatRepository) CreateChat(chat models.Chat) (uint, error) {
	var chatID uint
	query := `INSERT INTO chats (title, image_url) VALUES ($1, $2) RETURNING id`
	err := r.db.QueryRow(query, chat.Title, chat.ImageURL).Scan(&chatID)
	if err != nil {
		return 0, err
	}
	return chatID, nil
}

func (r *chatRepository) GetAllChats() ([]models.Chat, error) {
	var chats []models.Chat
	query := `SELECT id, title, image_url FROM chats`
	err := r.db.Select(&chats, query)
	if err != nil {
		return nil, err
	}
	return chats, nil
}

func (r *chatRepository) GetChatByID(chatID uint) (models.Chat, error) {
	var chat models.Chat
	query := `SELECT id, title, image_url FROM chats WHERE id = $1`
	err := r.db.Get(&chat, query, chatID)
	if err != nil {
		return models.Chat{}, err
	}
	return chat, nil
}

func (r *chatRepository) UpdateChat(chatID uint, input models.Chat) error {
	query := `UPDATE chats SET title = $1, image_url = $2 WHERE id = $3`
	_, err := r.db.Exec(query, input.Title, input.ImageURL, chatID)
	if err != nil {
		return err
	}
	return nil
}

func (r *chatRepository) DeleteChat(chatID uint) error {
	query := `DELETE FROM chats WHERE id = $1`
	_, err := r.db.Exec(query, chatID)
	if err != nil {
		return err
	}
	return nil
}

func (r *chatRepository) GetMessagesByChatID(chatID uint) ([]models.Message, error) {
	var messages []models.Message
	query := `SELECT id, chat_id, user_id, text, time FROM messages WHERE chat_id = $1 ORDER BY time`
	err := r.db.Select(&messages, query, chatID)
	if err != nil {
		return nil, err
	}
	return messages, nil
}

func (r *chatRepository) CreateMessage(message models.Message) (uint, error) {
	var messageID uint
	query := `INSERT INTO messages (chat_id, user_id, text, time) VALUES ($1, $2, $3, $4) RETURNING id`
	err := r.db.QueryRow(query, message.ChatID, message.UserID, message.Text, message.Time).Scan(&messageID)
	if err != nil {
		return 0, err
	}
	return messageID, nil
}

func (r *chatRepository) GetMessageByID(messageID uint) (models.Message, error) {
	var message models.Message
	query := `SELECT id, chat_id, user_id, text, time FROM messages WHERE id = $1`
	err := r.db.Get(&message, query, messageID)
	if err != nil {
		return models.Message{}, err
	}
	return message, nil
}

func (r *chatRepository) UpdateMessage(messageID uint, input models.Message) error {
	query := `UPDATE messages SET text = $1 WHERE id = $2`
	_, err := r.db.Exec(query, input.Text, messageID)
	if err != nil {
		return err
	}
	return nil
}

func (r *chatRepository) DeleteMessage(messageID uint) error {
	query := `DELETE FROM messages WHERE id = $1`
	_, err := r.db.Exec(query, messageID)
	if err != nil {
		return err
	}
	return nil
}
