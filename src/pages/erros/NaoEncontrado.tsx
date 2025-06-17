import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NaoEncontrado: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100">
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Página não encontrada
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-gray-500 mb-6 text-center">
            Verifique se o endereço digitado está correto ou retorne para a página inicial.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NaoEncontrado;