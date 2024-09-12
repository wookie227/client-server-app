import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Иконка плюсика
import CreateNewsDialog from './CreateNewsDialog'; // Импортируем компонент формы создания новостей
import styles from './News.module.css';

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false); // Состояние для управления диалогом

  useEffect(() => {
    const fetchNews = async () => {
      const token = Cookies.get('authToken');

      try {
        const response = await fetch('http://localhost:8000/api/news', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setNewsList(data);
      } catch (error) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className={styles.newsContainer}>
        <h1>Latest News</h1>
        {newsList && newsList.length > 0 ? (
          newsList.map((news) => (
            <div key={news.id} className={styles.newsItem}>
              <h2>{news.title}</h2>
              <p>
                <strong>
                  {news.user_name} {news.surname}
                </strong>
              </p>
              <p>{news.text}</p>
              {news.image_url && (
                <img src={news.image_url} alt={news.title} className={styles.newsImage} />
              )}
            </div>
          ))
        ) : (
          <p>No news available</p>
        )}
      </div>

      {/* Кнопка для открытия формы создания новости */}
      <Fab
        color="primary"
        className={styles.fab}
        style={{position:'fixed'}} // Применяем стили для позиционирования
        onClick={() => setOpenCreateDialog(true)} // Открываем диалог
      >
        <AddIcon />
      </Fab>

      {/* Диалоговое окно для создания новости */}
      <CreateNewsDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)} // Закрываем диалог
      />
    </>
  );
};

export default News;
