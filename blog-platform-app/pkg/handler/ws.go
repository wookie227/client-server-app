package handler

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// Используем для апгрейда соединения HTTP до WebSocket
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Здесь можно добавить проверку разрешенных источников
		return true
	},
}

// Hub — центральный узел для управления подключениями WebSocket
type Hub struct {
	clients    map[*websocket.Conn]bool // Подключенные клиенты
	broadcast  chan []byte              // Канал для отправки сообщений всем клиентам
	register   chan *websocket.Conn     // Регистрация новых клиентов
	unregister chan *websocket.Conn     // Отключение клиентов
	mu         sync.Mutex               // Мьютекс для безопасного доступа к данным
}

// Создаем новый хаб
func newHub() *Hub {
	return &Hub{
		clients:    make(map[*websocket.Conn]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
	}
}

// Запуск хаба
func (h *Hub) run() {
	for {
		select {
		case conn := <-h.register:
			h.mu.Lock()
			h.clients[conn] = true
			h.mu.Unlock()
		case conn := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[conn]; ok {
				delete(h.clients, conn)
				conn.Close()
			}
			h.mu.Unlock()
		case message := <-h.broadcast:
			h.mu.Lock()
			for conn := range h.clients {
				err := conn.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					conn.Close()
					delete(h.clients, conn)
				}
			}
			h.mu.Unlock()
		}
	}
}

// Обработчик подключения WebSocket
func (h *Hub) handleConnections(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer func() {
		h.unregister <- conn
	}()

	h.register <- conn

	// Чтение сообщений от клиентов
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}
		// Отправляем сообщение всем подключенным клиентам
		h.broadcast <- message
	}
}
