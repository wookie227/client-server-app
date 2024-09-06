import React from 'react';
import styles from './Chat.module.css'; // добавь стили, если нужно

const Chat: React.FC = () => {
  return (
    <div className={styles.chatContainer}>
      <h1>Chat Room</h1>
      <p>This is the chat page. You can talk with other users here.</p>
      {/* Здесь будет чат */}
    </div>
  );
};

export default Chat;
