import React, { useEffect, useState } from 'react';
import styles from './Users.module.css'; // Подключаем стили
import Cookies from 'js-cookie';

interface User {
  email: string;
  phone: string;
  surname: string;
  name: string;
  patronymic: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
        const token = Cookies.get('authToken');
      
        try {
          const response = await fetch('http://localhost:8000/api/users', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          setError('Failed to fetch users');
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.usersContainer}>
      <h1>All Users Here</h1>
      <p>This is the users page. Here you will find your new friends.</p>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Phone</th>
            <th>Surname</th>
            <th>Name</th>
            <th>Patronymic</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.surname}</td>
              <td>{user.name}</td>
              <td>{user.patronymic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
