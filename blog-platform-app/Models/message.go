package models

import "time"

type Message struct {
	ID     uint      `db:"id"`
	ChatID uint      `db:"chat_id"` // Убедитесь, что название совпадает с названием в БД
	UserID uint      `db:"user_id"`
	Text   string    `db:"text"`
	Time   time.Time `db:"time"`
}
