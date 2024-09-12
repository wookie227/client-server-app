package models

import "time"

type News struct {
	ID       uint      `json:"id" db:"id"`               // ID новости
	UserID   uint      `json:"user_id" db:"user_name"`   // ID пользователя, который создал новость
	Title    string    `json:"title" db:"title"`         // Заголовок новости
	Text     string    `json:"text" db:"text"`           // Текст новости
	ImageURL string    `json:"image_url" db:"image_url"` // URL изображения
	Date     time.Time `json:"date" db:"date"`           // Дата создания новости
}
