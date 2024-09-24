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

func (s *NewsListService) Create(news models.News) (*models.News, error) {
	return s.repo.Create(news)
}

func (s *NewsListService) Delete(id int) error {
	return s.repo.Delete(id)
}
