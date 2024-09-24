import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import Cookies from 'js-cookie';

interface CreateNewsDialogProps {
  open: boolean;
  onClose: () => void;
  editingNews?: any; // Новый пропс для передачи редактируемой новости
}

const CreateNewsDialog: React.FC<CreateNewsDialogProps> = ({ open, onClose, editingNews }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Если мы редактируем, заполняем поля
  useEffect(() => {
    if (editingNews) {
      setTitle(editingNews.title);
      setText(editingNews.text);
    } else {
      // Очистка полей при создании новой новости
      setTitle('');
      setText('');
      setImage(null);
    }
  }, [editingNews]);

  // Обработка выбора файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Обработка отправки формы
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);

    if (image) {
      formData.append('file', image);
    }

    const token = Cookies.get('authToken');
    if (!token) {
      setError('Токен аутентификации отсутствует');
      return;
    }

    try {
      const url = editingNews 
        ? `http://localhost:8000/api/news/${editingNews.id}`
        : 'http://localhost:8000/api/news';

      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(editingNews ? 'Не удалось обновить новость' : 'Не удалось создать новость');
      }

      const result = await response.json();
      console.log('Новость успешно обработана:', result);

      onClose();
      window.location.reload();
    } catch (error) {
      setError(editingNews ? 'Ошибка при обновлении новости' : 'Ошибка при создании новости');
      console.error('Ошибка:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{editingNews ? 'Редактировать новость' : 'Создать новую новость'}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              label="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Текст"
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                Загрузить изображение
              </Button>
            </label>
            {image && (
              <Grid container spacing={2} marginTop={2}>
                <Grid item>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Отмена
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {editingNews ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewsDialog;
