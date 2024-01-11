import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/login';
import RegisterForm from './components/registro';
import MenuAdmin from './components/menuadmin';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const renderContent = () => {
    const storedToken = localStorage.getItem('token');
    if (user) {
        return <MenuAdmin />;
    }
    return <LoginForm onLogin={handleLogin} />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={renderContent()} />
        <Route path="/registro" element={<RegisterForm />} />
        <Route path="/home" element={<MenuAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
