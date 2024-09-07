package repository

import (
	models "blog-platform-app/Models"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type UsersListPostgres struct {
	db *sqlx.DB
}

func NewUsersListPostgres(db *sqlx.DB) *UsersListPostgres {
	return &UsersListPostgres{db: db}
}

func (r *UsersListPostgres) GetAll() ([]models.User, error) {
	var users []models.User

	query := fmt.Sprintf("SELECT id, email, phone, surname, name, patronymic FROM %s", usersTable)
	err := r.db.Select(&users, query)

	return users, err
}
