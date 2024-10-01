import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './Chat.module.css';
import Cookies from 'js-cookie';
import { RootState } from '../store/store';

interface User {
  id: number;
  email: string;
  phone: string;
  surname: string;
  name: string;
  patronymic: string;
}

interface Message {
  userId: number; // ID пользователя, с которым ведется переписка
  senderId: number; // ID пользователя, который отправил сообщение
  text: string; // Содержание сообщения
}

const Chat: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null); // Добавили состояние для WebSocket

  // Получаем текущего пользователя из Redux-хранилища
  const currentUser = useSelector((state: RootState) => state.user);

  // Подключение к WebSocket при монтировании компонента
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      // Проверка на то, что сообщение принадлежит текущему чату
      if (
        (receivedMessage.userId === currentUser.userId &&
          receivedMessage.senderId === selectedUser?.id) ||
        (receivedMessage.userId === selectedUser?.id &&
          receivedMessage.senderId === currentUser.userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [currentUser.userId, selectedUser?.id]);

  // Получение списка всех пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('authToken');

      try {
        const response = await fetch('http://localhost:8000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const filteredUsers = data.filter(
          (user: User) => user.email !== currentUser.email
        );
        setUsers(filteredUsers);
      } catch (error) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser.email]);

  // Отправка сообщения через WebSocket
  const handleSendMessage = () => {
    if (message.trim() && selectedUser && ws) {
      const newMessage: Message = {
        userId: selectedUser.id, // ID пользователя, с которым мы общаемся
        senderId: currentUser.userId!, // ID текущего пользователя, как отправителя
        text: message,
      };

      // Отправляем сообщение через WebSocket
      ws.send(JSON.stringify(newMessage));

      // Добавляем отправленное сообщение в локальное состояние
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  // Обработка выбора пользователя
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setMessages([]); // Очистим сообщения при выборе нового пользователя
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.chatPage}>
      {/* Список пользователей слева */}
      <div className={styles.usersList}>
        <h2 className={styles.usersTitle}>Users</h2>
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={`${styles.userItem} ${
                selectedUser?.id === user.id ? styles.activeUser : ''
              }`}
              onClick={() => handleUserSelect(user)}
            >
              {user.name} {user.surname}
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* Основной чат с выбранным пользователем */}
      <div className={styles.chatContainer}>
        {selectedUser ? (
          <>
            <h2 className={styles.chatTitle}>Chat with {selectedUser.name}</h2>
            <div className={styles.messagesContainer}>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${styles.message} ${
                      msg.senderId === currentUser.userId
                        ? styles.myMessage
                        : styles.theirMessage
                    }`}
                  >
                    <strong>
                      {msg.senderId === currentUser.userId ? 'You' : selectedUser.name}:
                    </strong>{' '}
                    {msg.text}
                  </div>
                ))
              ) : (
                <p className={styles.noMessages}>No messages yet.</p>
              )}
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={message}
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                className={styles.messageInput}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className={styles.sendButton}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Please select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
