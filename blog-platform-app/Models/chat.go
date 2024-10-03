package models

type Chat struct {
	ID       uint    `db:"id"`
	Title    string  `db:"title"`
	ImageURL *string `db:"image_url"`
}
