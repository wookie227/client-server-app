import React, { useState } from 'react';
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
}

const CreateNewsDialog: React.FC<CreateNewsDialogProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Обработка выбора файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Обработка формы отправки
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);

    if (image) {
      formData.append('file', image);
    }

    const token = Cookies.get('authToken');
    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/news', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create news');
      }

      const result = await response.json();
      console.log('News created:', result);

      onClose();
      window.location.reload();
    } catch (error) {
      setError('Error creating news');
      console.error('Error:', error);
    }
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
              <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                Upload Image
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
