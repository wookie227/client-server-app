import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { TextField, Button } from '@mui/material';

interface RegisterFormData {
  email: string;
  phone: string;
  surname: string;
  name: string;
  patronymic: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    phone: '',
    surname: '',
    name: '',
    patronymic: '',
    password: ''
  });

  const navigate = useNavigate(); // используем навигацию

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

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
      console.log(response.body);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      // Дополнительная логика при успешной регистрации
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.registerTitle}>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="Email"
          id="inputEmailSignUp"
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          id="inputPhoneSignUp"
          margin="normal"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          label="Surname"
          id="inputSurnameSignUp"
          margin="normal"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />
        <TextField
          label="Name"
          id="inputNameSignUp"
          margin="normal"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Patronymic"
          id="inputPatronymicSignUp"
          margin="normal"
          name="patronymic"
          value={formData.patronymic}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          id="inputPasswordSignUp"
          margin="normal"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" disabled={!isFormValid}>
          Register
        </Button>
      </form>
      <p className={styles.switchText} onClick={() => navigate('/login')}>
        Already have an account? Login
      </p>
    </div>
  );
};

export default Register;
