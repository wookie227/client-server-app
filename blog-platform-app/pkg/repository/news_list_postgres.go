package repository

import (
	models "blog-platform-app/Models"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type NewsListPostgres struct {
	db *sqlx.DB
}

func NewNewsListPostgres(db *sqlx.DB) *NewsListPostgres {
	return &NewsListPostgres{db: db}
}

func (r *NewsListPostgres) Create(news models.News) (*models.News, error) {
	query := `
	INSERT INTO news (user_id, title, text, image_url, date)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING id
	`
	var id uint
	fmt.Println(news)
	err := r.db.QueryRow(query, news.UserID, news.Title, news.Text, news.ImageURL, news.Date).Scan(&id)
	if err != nil {
		return nil, fmt.Errorf("error inserting news into database: %v", err)
	}

	// Возвращаем созданную новость с заполненным ID
	news.ID = id
	return &news, nil
}

func (r *NewsListPostgres) GetAll() ([]models.NewsDTO, error) {
	var news []models.NewsDTO

	query := `
    SELECT n.id, n.user_id, u.name AS user_name, u.surname, n.title, n.text, n.image_url, n.date
    FROM news n
    JOIN users u ON n.user_id = u.id
    `

	err := r.db.Select(&news, query)
	if err != nil {
		return nil, err
	}

	return news, nil
}
