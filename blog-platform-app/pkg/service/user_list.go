package service

import (
	models "blog-platform-app/models"
	"blog-platform-app/pkg/repository"
)

type UsersListService struct {
	repo repository.Users
}

func NewUsersListService(repo repository.Users) *UsersListService {
	return &UsersListService{repo: repo}
}

func (s *UsersListService) GetAll() ([]models.User, error) {
	return s.repo.GetAll()
}
