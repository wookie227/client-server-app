import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import styles from './App.module.css'

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className={styles.App} >
      {isLogin ? <Login onSwitchToRegister={switchToRegister} /> : <Register onSwitchToLogin={switchToLogin} />}
    </div>
  );
};

export default App;
