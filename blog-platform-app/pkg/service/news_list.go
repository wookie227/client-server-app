package service

import (
	models "blog-platform-app/Models"
	"blog-platform-app/pkg/repository"
)

type NewsListService struct {
	repo repository.News
}

func NewNewsListService(repo repository.News) *NewsListService {
	return &NewsListService{repo: repo}
}

func (s *NewsListService) GetAll() ([]models.NewsDTO, error) {
	return s.repo.GetAll()
}
