package handler

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	UserId   int    `json:"userId"`   // ID получателя
	SenderId int    `json:"senderId"` // ID отправителя
	Text     string `json:"text"`     // Текст сообщения
}

type Hub struct {
	clients    map[int]*websocket.Conn // Подключенные клиенты, теперь по userID
	broadcast  chan Message            // Канал для отправки сообщений всем клиентам
	register   chan *websocket.Conn    // Регистрация новых клиентов
	unregister chan *websocket.Conn    // Отключение клиентов
	mu         sync.Mutex              // Мьютекс для безопасного доступа к данным
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[int]*websocket.Conn),
		broadcast:  make(chan Message),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
	}
}

func (h *Hub) run() {
	for {
		select {
		case message := <-h.broadcast:
			h.mu.Lock()
			if conn, ok := h.clients[message.UserId]; ok {
				// Отправляем сообщение конкретному пользователю
				err := conn.WriteJSON(message)
				if err != nil {
					log.Println("Error sending message:", err)
					conn.Close()
					delete(h.clients, message.UserId)
				}
			}
			h.mu.Unlock()
		}
	}
}

func (h *Hub) handleConnections(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer func() {
		h.unregister <- conn
	}()

	// Важно: предполагается, что userID будет передаваться в качестве параметра URL, например, /ws?userId=1
	userIdStr := c.Query("userId")
	if userIdStr == "" {
		log.Println("User ID is missing")
		return
	}

	// Преобразуйте userID из строки в int
	var userId int
	if _, err := fmt.Sscanf(userIdStr, "%d", &userId); err != nil {
		log.Println("Invalid User ID")
		return
	}

	// Регистрируем подключение
	h.mu.Lock()
	h.clients[userId] = conn
	h.mu.Unlock()

	for {
		var message Message
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println("Error reading JSON message:", err)
			break
		}

		// Отправляем сообщение в канал broadcast
		h.broadcast <- message
	}
}
