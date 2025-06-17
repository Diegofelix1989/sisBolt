import React from 'react';
import { Outlet } from 'react-router-dom';
import { Users } from 'lucide-react';

const PublicoLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
          <Users className="h-8 w-8 text-white mr-3" />
          <h1 className="text-2xl font-bold text-white">
            Sistema de Gerenciamento de Filas
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Sistema de Gerenciamento de Filas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicoLayout;