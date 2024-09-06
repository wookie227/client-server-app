package models

type User struct {
	ID         uint   `json:"-" db:"id"`
	Email      string `json:"email" binding:"required"`
	Phone      string `json:"phone" binding:"required"`
	Surname    string `json:"surname" binding:"required"`
	Name       string `json:"name" binding:"required"`
	Patronymic string `json:"patronymic" binding:"required"`
	Password   string `json:"password" binding:"required"`
	Role       string `json:"role"`
}
