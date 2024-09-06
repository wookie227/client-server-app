import React from 'react';
import styles from './News.module.css'; // добавь стили, если нужно

const News: React.FC = () => {
  return (
    <div className={styles.newsContainer}>
      <h1>Latest News</h1>
      <p>This is the news page. Here you will find the latest updates and articles.</p>
      {/* Здесь можно вывести новости */}
    </div>
  );
};

export default News;
