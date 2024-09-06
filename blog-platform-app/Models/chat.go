package models

type Chat struct {
	ID       uint `gorm:"primaryKey"`
	Title    string
	ImageURL string
}
