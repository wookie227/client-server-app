import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Login.module.css';
import {TextField, Button} from '@mui/material'
import './a.css'

interface LoginProps {
  onSwitchToRegister: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

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
      });
      console.log(response.body)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      // Дополнительная логика при успешной регистрации
    } catch (error) {
      console.error('Error:', error);
      // Логика обработки ошибок
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
      <TextField variant="standard" label={'Email'} id="inputEmailSignIn" margin="normal" onSubmit={handleChange}/>
      <TextField variant="standard" label={'Password'} id="inputPasswordSignIn" margin="normal" onSubmit={handleChange} />
        <Button variant='contained' type="submit" className='marginAll'>
          Login
        </Button>
      </form>
      <p className={styles.switchText} onClick={onSwitchToRegister}>
        Don't have an account? Register
      </p>
    </div>
  );
};

export default Login;
