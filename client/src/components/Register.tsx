import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Register.module.css';
import {TextField, Button} from '@mui/material'

interface RegisterProps {
  onSwitchToLogin: () => void;
}

interface RegisterFormData {
  email: string;
  phone: string;
  surname: string;
  name: string;
  patronymic: string;
  password: string;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    phone: '',
    surname: '',
    name: '',
    patronymic: '',
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
      const response = await fetch('http://localhost:8000/auth/sign-up', {
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
    <div className={styles.registerContainer}>
      <h2 className={styles.registerTitle}>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField label={'Email'} id="inputEmailSignUp" margin="normal" onSubmit={handleChange}/>
        <TextField label={'Phone'} id="inputPhoneSignUp" margin="normal" onSubmit={handleChange}/>
        <TextField label={'Surname'} id="inputSurnameSignUp" margin="normal" onSubmit={handleChange}/>
        <TextField label={'Name'} id="inputNameSignUp" margin="normal" onSubmit={handleChange}/>
        <TextField label={'Patronymic'} id="inputPatronymicSignUp" margin="normal" onSubmit={handleChange}/>
        <TextField label={'Password'} id="inputPasswordSignUp" margin="normal" onSubmit={handleChange}/>
        <Button type="submit" variant='contained'>
          Register
        </Button>
      </form>
      <p className={styles.switchText} onClick={onSwitchToLogin}>
        Already have an account? Login
      </p>
    </div>
  );
};

export default Register;
