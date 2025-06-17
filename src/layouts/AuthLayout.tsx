import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (usuario) {
    // Redirecionar para a página apropriada se já estiver autenticado
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserCircle className="h-20 w-20 text-blue-800" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Gerenciamento de Filas
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;