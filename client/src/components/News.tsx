// src/components/News.tsx
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Fab, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateNewsDialog from './CreateNewsDialog';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Импортируйте RootState
import styles from './News.module.css';

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  
  const user = useSelector((state: RootState) => state.user); // Получаем информацию о пользователе

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

  const handleEdit = (news: any) => {
    setEditingNews(news);
    setOpenCreateDialog(true);
  };

  const handleDelete = async (newsId: number) => {
    const token = Cookies.get('authToken');
    
    try {
      const response = await fetch(`http://localhost:8000/api/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete news');
      }

      setNewsList(newsList.filter((news) => news.id !== newsId)); // Обновляем список новостей
    } catch (error) {
      console.error('Error deleting news:', error);
      setError('Failed to delete news');
    }
  };

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
                <img
                  src={`http://localhost:8000${news.image_url}`}
                  alt={news.title}
                  className={styles.newsImage}
                />
              )}
              {/* Проверяем, принадлежит ли новость текущему пользователю */}
              {user.isAuthenticated && user.userId === news.user_id && (
                <div className={styles.buttonsContainer}>
                  <Button variant="outlined" onClick={() => handleEdit(news)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(news.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No news available</p>
        )}
      </div>

      <Fab
        color="primary"
        className={styles.fab}
        style={{ position: 'fixed' }}
        onClick={() => {
          setEditingNews(null); // Обнуляем состояние редактирования перед открытием диалога
          setOpenCreateDialog(true);
        }}
      >
        <AddIcon />
      </Fab>

      <CreateNewsDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        // newsToEdit={editingNews} // Передаем новость для редактирования
      />
    </>
  );
};

export default News;
