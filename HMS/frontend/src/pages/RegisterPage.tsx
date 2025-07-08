import React from 'react';
import { Helmet } from 'react-helmet-async';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Register - HMS</title>
        <meta name="description" content="Create your HMS account" />
      </Helmet>
      
      <RegisterForm />
    </>
  );
};

export default RegisterPage; 