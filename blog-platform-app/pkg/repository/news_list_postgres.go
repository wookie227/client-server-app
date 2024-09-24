package repository

import (
	models "blog-platform-app/Models"
	"database/sql"
	"fmt"
	"os"

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

func (r *NewsListPostgres) Update(news models.News) (*models.News, error) {
	query := `
	UPDATE news 
	SET title = $1, text = $2, image_url = $3, date = $4
	WHERE id = $5 AND user_id = $6
	RETURNING id, user_id, title, text, image_url, date
	`

	var updatedNews models.News
	err := r.db.QueryRow(query, news.Title, news.Text, news.ImageURL, news.Date, news.ID, news.UserID).
		Scan(&updatedNews.ID, &updatedNews.UserID, &updatedNews.Title, &updatedNews.Text, &updatedNews.ImageURL, &updatedNews.Date)
	if err != nil {
		return nil, fmt.Errorf("error updating news in database: %v", err)
	}

	return &updatedNews, nil
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

func (r *NewsListPostgres) Delete(id int) error {
	// Сначала получаем информацию о новости, чтобы узнать путь к изображению
	var imageURL string
	querySelect := "SELECT image_url FROM news WHERE id = $1"
	err := r.db.QueryRow(querySelect, id).Scan(&imageURL)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("record with id %d not found", id)
		}
		return fmt.Errorf("error fetching news by id: %v", err)
	}

	// Если изображение существует, удаляем его
	if imageURL != "" {
		imagePath := "." + imageURL // Убедитесь, что путь к файлу корректен
		if err := os.Remove(imagePath); err != nil && !os.IsNotExist(err) {
			return fmt.Errorf("failed to delete associated image file: %v", err)
		}
	}

	// Теперь удаляем запись из базы данных
	queryDelete := "DELETE FROM news WHERE id = $1"
	result, err := r.db.Exec(queryDelete, id)
	if err != nil {
		return fmt.Errorf("error deleting news from database: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("record with id %d not found", id)
	}

	return nil
}
