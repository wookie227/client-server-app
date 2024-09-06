package repository

import (
	models "blog-platform-app/Models"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (r *AuthPostgres) CreateUser(user models.User) (int, error) {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (email, phone, surname, name, patronymic, password, role) values ($1, $2, $3, $4, $5, $6, 'user') RETURNING id", usersTable)
	row := r.db.QueryRow(query, user.Email, user.Phone, user.Surname, user.Name, user.Patronymic, user.Password)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

func (r *AuthPostgres) GetUser(email, password string) (models.User, error) {
	var user models.User
	query := fmt.Sprintf("Select id FROM %s where email=$1 AND password=$2", usersTable)
	err := r.db.Get(&user, query, email, password)

	return user, err
}
