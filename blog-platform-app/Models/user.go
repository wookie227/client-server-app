package models

type User struct {
	ID         uint   `json:"-" db:"id"`
	Email      string `json:"email" binding:"required" db:"email"`
	Phone      string `json:"phone" binding:"required" db:"phone"`
	Surname    string `json:"surname" binding:"required" db:"surname"`
	Name       string `json:"name" binding:"required" db:"name"`
	Patronymic string `json:"patronymic" binding:"required" db:"patronymic"`
	Password   string `json:"password" binding:"required"`
	Role       string `json:"role"`
}
