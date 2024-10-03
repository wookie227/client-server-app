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

interface Chat {
  id: number;
  title: string;
  imageURL: string | null;
}

interface Message {
  id: number;
  chatId: number;
  userId: number;
  text: string;
  time: string;
}

const Chat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useSelector((state: RootState) => state.user);
  const ws = React.useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    const handleMessage = (event: MessageEvent) => {
      const receivedMessage: Message = JSON.parse(event.data);
      console.log("Полученное сообщение:", receivedMessage);

      if (receivedMessage.chatId === selectedChat?.id) {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    };

    ws.current.addEventListener('message', handleMessage);

    return () => {
      ws.current?.removeEventListener('message', handleMessage);
    };
  }, [selectedChat]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const token = Cookies.get('authToken');
      try {
        const response = await fetch('http://localhost:8000/api/chats', {
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
        console.log("Fetched chats:", data); // Отладочное сообщение

        const formattedChats = data.map((chat: any) => ({
          id: chat.ID,
          title: chat.Title,
          imageURL: chat.ImageURL || null,
        }));

        setChats(formattedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Не удалось загрузить чаты');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() && selectedChat && currentUser.userId !== null) {
      const newMessage: Message = {
        id: Date.now(),
        chatId: selectedChat.id,
        userId: currentUser.userId,
        text: message,
        time: new Date().toISOString(),
      };
      console.log("Отправляемое сообщение:", newMessage); // Логирование отправляемого сообщения
      const token = Cookies.get('authToken');
      try {
        const response = await fetch(
          `http://localhost:8000/api/chats/${selectedChat.id}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newMessage),
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorMsg = await response.text();
          console.error('Error response from server:', errorMsg); // Отладочное сообщение
          throw new Error('Не удалось отправить сообщение');
        }

        const savedMessage = await response.json(); // Получаем сохраненное сообщение
        console.log("Message saved:", savedMessage); // Отладочное сообщение
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setMessage(''); // Очищаем поле ввода
    } else {
      console.warn("Сообщение пустое или чат не выбран"); // Отладочное сообщение
    }
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    const token = Cookies.get('authToken');

    if (!chat.id) {
      console.error("Invalid chat ID:", chat.id);
      setError('Недействительный идентификатор чата');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/chats/${chat.id}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Не удалось загрузить сообщения: ${errorMsg}`);
      }

      const data = await response.json();
      console.log("Fetched messages for chat:", data); // Для отладки
      setMessages(data); // Установите сообщения, даже если это пустой массив
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Не удалось загрузить сообщения');
    }
  };

  if (loading) return <p>Загрузка...</p>; // Локализованный текст
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatsList}>
        <h2>Чаты</h2>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${
                selectedChat?.id === chat.id ? styles.activeChat : ''
              }`}
              onClick={() => handleChatSelect(chat)}
            >
              <img
                src={chat.imageURL || '/default-image.png'}
                alt="Chat"
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
              {chat.title}
            </div>
          ))
        ) : (
          <p>Нет доступных чатов</p>
        )}
      </div>

      <div className={styles.chatContainer}>
        {selectedChat ? (
          <>
            <h2>Чат: {selectedChat.title}</h2>
            <div className={styles.messagesContainer}>
              {messages.length > 0 ? (
                messages.map((msg) => {
                  return (
                    <div
                      key={msg.id}
                      className={`${styles.message} ${
                        msg.userId === currentUser.userId
                          ? styles.myMessage
                          : styles.theirMessage
                      }`}
                    >
                      <strong>
                        {msg.userId === currentUser.userId ? 'Вы' : 'Другой'}:
                      </strong>{' '}
                      {msg.text}
                    </div>
                  );
                })
              ) : (
                <p>Сообщений еще нет.</p> // Локализованный текст
              )}
            </div>


            <div className={styles.inputContainer}>
              <input
                type="text"
                value={message}
                placeholder="Напишите ваше сообщение..."
                onChange={(e) => setMessage(e.target.value)}
                className={styles.messageInput}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className={styles.sendButton}>
                Отправить
              </button>
            </div>
          </>
        ) : (
          <p>Выберите чат, чтобы начать общение.</p> // Локализованный текст
        )}
      </div>
    </div>
  );
};

export default Chat;
