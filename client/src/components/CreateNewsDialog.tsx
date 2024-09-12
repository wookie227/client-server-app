import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface CreateNewsDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateNewsDialog: React.FC<CreateNewsDialogProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageURL, setImageURL] = useState<string | ArrayBuffer | null>(null);

  // Обработка выбора файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработка формы отправки
  const handleSubmit = () => {
    const newsData = {
      title,
      text,
      imageURL,
    };

    console.log('News data:', newsData); // Тут можно добавить отправку данных на сервер
    onClose(); // Закрыть окно после отправки
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create a New Post</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Text"
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
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Upload Image
              </Button>
            </label>
            {imageURL && (
              <Grid container spacing={2} marginTop={2}>
                <Grid item>
                  <img
                    src={imageURL as string}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewsDialog;
