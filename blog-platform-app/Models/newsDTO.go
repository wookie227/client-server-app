package models

import "time"

type NewsDTO struct {
	ID       uint      `json:"id" db:"id"`
	UserName string    `json:"user_name" db:"user_name"` // Сопоставляем с псевдонимом user_name
	Surname  string    `json:"surname" db:"surname"`     // Добавляем поле Surname
	Title    string    `json:"title" db:"title"`
	Text     string    `json:"text" db:"text"`
	ImageURL string    `json:"image_url" db:"image_url"`
	Date     time.Time `json:"date" db:"date"`
}
