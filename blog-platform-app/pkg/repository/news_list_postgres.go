package repository

import (
	models "blog-platform-app/Models"

	"github.com/jmoiron/sqlx"
)

type NewsListPostgres struct {
	db *sqlx.DB
}

func NewNewsListPostgres(db *sqlx.DB) *NewsListPostgres {
	return &NewsListPostgres{db: db}
}

func (r *NewsListPostgres) GetAll() ([]models.NewsDTO, error) {
	var news []models.NewsDTO

	// SQL-запрос для получения новостей с именем пользователя
	query := `
    SELECT n.id, u.name AS user_name, u.surname, n.title, n.text, n.image_url, n.date
    FROM news n
    JOIN users u ON n.user_id = u.id
    `

	err := r.db.Select(&news, query)
	if err != nil {
		return nil, err
	}

	return news, nil
}
