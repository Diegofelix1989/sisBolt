import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { DadosAutenticacao } from '../../types';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { login, carregando } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<DadosAutenticacao>();

  const onSubmit = async (data: DadosAutenticacao) => {
    await login(data);
  };

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Digite seu email"
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="mt-1">
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.senha ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              {...register('senha', { 
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres'
                }
              })}
            />
            {errors.senha && (
              <p className="mt-2 text-sm text-red-600">{errors.senha.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="lembrar"
              name="lembrar"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-900">
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {carregando ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Credenciais de demonstração
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-3">
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="text-xs text-gray-700 font-medium">Master Admin:</p>
            <p className="text-xs text-gray-600">Email: master@sistema.com</p>
            <p className="text-xs text-gray-600">Senha: master123</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="text-xs text-gray-700 font-medium">Administrador:</p>
            <p className="text-xs text-gray-600">Email: admin@exemplo.com</p>
            <p className="text-xs text-gray-600">Senha: senha123</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="text-xs text-gray-700 font-medium">Atendente:</p>
            <p className="text-xs text-gray-600">Email: atendente@exemplo.com</p>
            <p className="text-xs text-gray-600">Senha: senha123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;