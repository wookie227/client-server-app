package models

import "time"

type News struct {
	ID       uint `gorm:"primaryKey"`
	UserID   uint `gorm:"not null"`
	User     User `gorm:"foreignKey:UserID"`
	Title    string
	Text     string
	ImageURL string
	Date     time.Time
}
