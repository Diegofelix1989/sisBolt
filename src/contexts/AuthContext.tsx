import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Usuario, DadosAutenticacao, TipoUsuario } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  login: (dados: DadosAutenticacao) => Promise<void>;
  logout: () => void;
  verificarAutenticacao: () => boolean;
  isMasterAdmin: () => boolean;
  isAdmin: () => boolean;
  isAtendente: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

const STORAGE_KEY = '@GerenciadorFilas:usuario';
const TOKEN_KEY = '@GerenciadorFilas:token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Carrega usuário do localStorage ao inicializar
  useEffect(() => {
    const recuperarUsuario = () => {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_KEY);

      if (storedUser && token) {
        setUsuario(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setCarregando(false);
    };

    recuperarUsuario();
  }, []);

  // Redireciona com base no estado de autenticação e tipo de usuário
  useEffect(() => {
    if (!carregando) {
      const paginaAtual = location.pathname;
      
      if (!usuario && !paginaAtual.startsWith('/emitir-ticket') && 
          !paginaAtual.startsWith('/painel') && paginaAtual !== '/login') {
        navigate('/login');
      } else if (usuario) {
        if (paginaAtual === '/login') {
          if (usuario.tipo === TipoUsuario.MASTER_ADMIN || usuario.tipo === TipoUsuario.ADMIN) {
            navigate('/dashboard');
          } else {
            navigate('/atendimento');
          }
        }
      }
    }
  }, [usuario, carregando, location.pathname, navigate]);

  const login = async (dados: DadosAutenticacao) => {
    try {
      setCarregando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let usuarioMock: Usuario;
      
      // Login de master admin
      if (dados.email === 'master@sistema.com' && dados.senha === 'master123') {
        usuarioMock = {
          id: 1,
          nome: 'Master Admin',
          email: 'master@sistema.com',
          tipo: TipoUsuario.MASTER_ADMIN,
          status: 'ativo',
          criado_em: new Date().toISOString()
        };
      }
      // Login de admin
      else if (dados.email === 'admin@exemplo.com' && dados.senha === 'senha123') {
        usuarioMock = {
          id: 2,
          nome: 'Administrador',
          email: 'admin@exemplo.com',
          tipo: TipoUsuario.ADMIN,
          empresa_id: 1,
          empresa: {
            id: 1,
            nome: 'Empresa Padrão',
            cnpj: '00.000.000/0001-00',
            status: 'ativo',
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          },
          status: 'ativo',
          criado_em: new Date().toISOString()
        };
      } 
      // Login de atendente
      else if (dados.email === 'atendente@exemplo.com' && dados.senha === 'senha123') {
        usuarioMock = {
          id: 3,
          nome: 'Atendente',
          email: 'atendente@exemplo.com',
          tipo: TipoUsuario.ATENDENTE,
          empresa_id: 1,
          empresa: {
            id: 1,
            nome: 'Empresa Padrão',
            cnpj: '00.000.000/0001-00',
            status: 'ativo',
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          },
          status: 'ativo',
          criado_em: new Date().toISOString()
        };
      } 
      // Login inválido
      else {
        throw new Error('Credenciais inválidas');
      }
      
      const token = 'token-mock-' + Math.random().toString(36).substring(2);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioMock));
      localStorage.setItem(TOKEN_KEY, token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUsuario(usuarioMock);
      
      if (usuarioMock.tipo === TipoUsuario.MASTER_ADMIN || usuarioMock.tipo === TipoUsuario.ADMIN) {
        navigate('/dashboard');
      } else {
        navigate('/atendimento');
      }
      
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Falha no login. Verifique suas credenciais.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
    setUsuario(null);
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  };

  const verificarAutenticacao = () => {
    return !!usuario;
  };

  const isMasterAdmin = () => {
    return usuario?.tipo === TipoUsuario.MASTER_ADMIN;
  };

  const isAdmin = () => {
    return usuario?.tipo === TipoUsuario.ADMIN;
  };

  const isAtendente = () => {
    return usuario?.tipo === TipoUsuario.ATENDENTE;
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      carregando, 
      login, 
      logout, 
      verificarAutenticacao,
      isMasterAdmin,
      isAdmin,
      isAtendente
    }}>
      {children}
    </AuthContext.Provider>
  );
};