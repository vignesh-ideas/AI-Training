import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} - HMS</title>
        <meta name="description" content="Hospital Management System authentication" />
      </Helmet>
      
      {isLogin ? (
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      )}
    </>
  );
};

export default LoginPage; 