package models

import "time"

type Message struct {
	ID     uint
	ChatID uint
	UserID uint
	Text   string
	Time   time.Time
}
