// src/components/Login.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/userSlice';
import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      // Сохраняем email и userId в Redux-хранилище
      dispatch(loginSuccess({ email: formData.email, userId: result.userId }));
      onLoginSuccess(); // Вызываем функцию после успешной авторизации
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          label="Email"
          id="inputEmailSignIn"
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          variant="standard"
          label="Password"
          id="inputPasswordSignIn"
          margin="normal"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button variant="contained" type="submit" className="marginAll">
          Login
        </Button>
      </form>
      <p className={styles.switchText} onClick={() => navigate('/register')}>
        Don't have an account? Register
      </p>
    </div>
  );
};

export default Login;
