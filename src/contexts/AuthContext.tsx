import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Usuario, DadosAutenticacao, TipoUsuario } from '../types';
import { toast } from 'react-hot-toast';
import type { User } from '@supabase/supabase-js';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar sessão existente
  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await carregarUsuario(session.user);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setCarregando(false);
      }
    };

    verificarSessao();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await carregarUsuario(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUsuario(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Carregar dados do usuário
  const carregarUsuario = async (user: User) => {
    try {
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          empresa:empresas(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar usuário:', error);
        return;
      }

      if (userData) {
        const usuarioFormatado: Usuario = {
          id: userData.id,
          nome: userData.nome,
          email: userData.email,
          tipo: userData.tipo as TipoUsuario,
          empresa_id: userData.empresa_id,
          empresa: userData.empresa ? {
            id: userData.empresa.id,
            nome: userData.empresa.nome,
            cnpj: userData.empresa.cnpj,
            status: userData.empresa.status,
            criado_em: userData.empresa.criado_em,
            atualizado_em: userData.empresa.atualizado_em
          } : undefined,
          status: userData.status,
          criado_em: userData.criado_em
        };

        setUsuario(usuarioFormatado);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Redirecionar com base no estado de autenticação
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dados.email,
        password: dados.senha,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await carregarUsuario(data.user);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUsuario(null);
      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
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