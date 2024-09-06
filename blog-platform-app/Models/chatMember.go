package models

type ChatMember struct {
	ID     uint `gorm:"primaryKey"`
	ChatID uint `gorm:"not null"`
	Chat   Chat `gorm:"foreignKey:ChatID"`
	UserID uint `gorm:"not null"`
	User   User `gorm:"foreignKey:UserID"`
}
