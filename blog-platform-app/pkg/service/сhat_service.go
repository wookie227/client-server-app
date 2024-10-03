package service

import (
	models "blog-platform-app/models"
	"blog-platform-app/pkg/repository"
)

type ChatService struct {
	repo repository.Chat
}

func NewChatService(repo repository.Chat) *ChatService {
	return &ChatService{repo: repo}
}

func (s *ChatService) CreateChat(chat models.Chat) (uint, error) {
	return s.repo.CreateChat(chat)
}

func (s *ChatService) GetAllChats() ([]models.Chat, error) {
	return s.repo.GetAllChats()
}

func (s *ChatService) GetChatByID(chatID uint) (models.Chat, error) {
	return s.repo.GetChatByID(chatID)
}

func (s *ChatService) UpdateChat(chatID uint, input models.Chat) error {
	return s.repo.UpdateChat(chatID, input)
}

func (s *ChatService) DeleteChat(chatID uint) error {
	return s.repo.DeleteChat(chatID)
}

func (s *ChatService) GetMessagesByChatID(chatID uint) ([]models.Message, error) {
	return s.repo.GetMessagesByChatID(chatID)
}

func (s *ChatService) CreateMessage(message models.Message) (uint, error) {
	return s.repo.CreateMessage(message)
}

func (s *ChatService) GetMessageByID(messageID uint) (models.Message, error) {
	return s.repo.GetMessageByID(messageID)
}

func (s *ChatService) UpdateMessage(messageID uint, input models.Message) error {
	return s.repo.UpdateMessage(messageID, input)
}

func (s *ChatService) DeleteMessage(messageID uint) error {
	return s.repo.DeleteMessage(messageID)
}
