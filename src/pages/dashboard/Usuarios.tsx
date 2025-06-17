import React, { useState, useEffect } from 'react';
import { User, UserPlus, Edit, Trash2, Search, X, Building2 } from 'lucide-react';
import { Usuario, TipoUsuario, StatusAtivo, Empresa } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface FormUsuario {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  tipo: TipoUsuario;
  empresa_id?: number;
}

function Usuarios() {
  const { isMasterAdmin, usuario: usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormUsuario>();
  
  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar empresas (apenas para master admin)
        const empresasMock: Empresa[] = [
          {
            id: 1,
            nome: 'Empresa Padrão',
            cnpj: '00.000.000/0001-00',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Tech Solutions Ltda',
            cnpj: '11.111.111/0001-11',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          }
        ];
        
        setEmpresas(empresasMock);
        
        // Carregar usuários
        const usuariosMock: Usuario[] = [
          {
            id: 1,
            nome: 'Master Admin',
            email: 'master@sistema.com',
            tipo: TipoUsuario.MASTER_ADMIN,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Administrador',
            email: 'admin@exemplo.com',
            tipo: TipoUsuario.ADMIN,
            empresa_id: 1,
            empresa: empresasMock[0],
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 3,
            nome: 'João Silva',
            email: 'joao@exemplo.com',
            tipo: TipoUsuario.ATENDENTE,
            empresa_id: 1,
            empresa: empresasMock[0],
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 4,
            nome: 'Maria Santos',
            email: 'maria@exemplo.com',
            tipo: TipoUsuario.ATENDENTE,
            empresa_id: 1,
            empresa: empresasMock[0],
            status: StatusAtivo.INATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 5,
            nome: 'Admin Tech',
            email: 'admin@tech.com',
            tipo: TipoUsuario.ADMIN,
            empresa_id: 2,
            empresa: empresasMock[1],
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        // Filtrar usuários baseado no tipo de usuário logado
        let usuariosFiltrados = usuariosMock;
        if (!isMasterAdmin()) {
          // Admin só vê usuários da sua empresa
          usuariosFiltrados = usuariosMock.filter(u => 
            u.empresa_id === usuarioLogado?.empresa_id
          );
        }
        
        setUsuarios(usuariosFiltrados);
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [isMasterAdmin, usuarioLogado]);

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.empresa?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar usuário
  const onSubmit = async (data: FormUsuario) => {
    try {
      if (data.senha !== data.confirmarSenha) {
        toast.error('As senhas não conferem');
        return;
      }

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (usuarioEditando) {
        // Atualizar usuário existente
        const usuarioAtualizado: Usuario = {
          ...usuarioEditando,
          nome: data.nome,
          email: data.email,
          tipo: data.tipo,
          empresa_id: isMasterAdmin() ? data.empresa_id : usuarioLogado?.empresa_id,
          empresa: isMasterAdmin() ? empresas.find(e => e.id === data.empresa_id) : usuarioLogado?.empresa
        };

        setUsuarios(usuarios.map(u => 
          u.id === usuarioEditando.id ? usuarioAtualizado : u
        ));
        
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        const novoUsuario: Usuario = {
          id: usuarios.length + 1,
          nome: data.nome,
          email: data.email,
          tipo: data.tipo,
          empresa_id: isMasterAdmin() ? data.empresa_id : usuarioLogado?.empresa_id,
          empresa: isMasterAdmin() ? empresas.find(e => e.id === data.empresa_id) : usuarioLogado?.empresa,
          status: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString()
        };

        setUsuarios([...usuarios, novoUsuario]);
        toast.success('Usuário criado com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar usuário');
      console.error(error);
    }
  };

  // Excluir usuário
  const excluirUsuario = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsuarios(usuarios.filter(u => u.id !== id));
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir usuário');
      console.error(error);
    }
  };

  // Alternar status do usuário
  const alternarStatus = async (usuario: Usuario) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = usuario.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setUsuarios(usuarios.map(u => 
        u.id === usuario.id 
          ? { ...u, status: novoStatus }
          : u
      ));
      
      toast.success(`Usuário ${novoStatus === StatusAtivo.ATIVO ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do usuário');
      console.error(error);
    }
  };

  const getTipoUsuarioLabel = (tipo: TipoUsuario) => {
    switch (tipo) {
      case TipoUsuario.MASTER_ADMIN:
        return 'Master Admin';
      case TipoUsuario.ADMIN:
        return 'Administrador';
      case TipoUsuario.ATENDENTE:
        return 'Atendente';
      default:
        return 'Usuário';
    }
  };

  const getTipoUsuarioColor = (tipo: TipoUsuario) => {
    switch (tipo) {
      case TipoUsuario.MASTER_ADMIN:
        return 'bg-red-100 text-red-800';
      case TipoUsuario.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case TipoUsuario.ATENDENTE:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os usuários {isMasterAdmin() ? 'do sistema' : 'da sua empresa'} e suas permissões
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setUsuarioEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Barra de busca */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex-1 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar usuários..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando usuários...</p>
          </div>
        ) : usuariosFiltrados.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {usuariosFiltrados.map((usuario) => (
              <li key={usuario.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{usuario.nome}</p>
                        <p className="text-sm text-gray-500">{usuario.email}</p>
                        {usuario.empresa && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {usuario.empresa.nome}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoUsuarioColor(usuario.tipo)}`}>
                        {getTipoUsuarioLabel(usuario.tipo)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.status === StatusAtivo.ATIVO ? 'Ativo' : 'Inativo'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alternarStatus(usuario)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            usuario.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {usuario.status === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {usuario.status === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setUsuarioEditando(usuario);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirUsuario(usuario.id)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando um novo usuário.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar usuário */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                          Nome
                        </label>
                        <input
                          type="text"
                          {...register('nome', { required: 'Nome é obrigatório' })}
                          defaultValue={usuarioEditando?.nome}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.nome && (
                          <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          {...register('email', { 
                            required: 'Email é obrigatório',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Email inválido'
                            }
                          })}
                          defaultValue={usuarioEditando?.email}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      {!usuarioEditando && (
                        <>
                          <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                              Senha
                            </label>
                            <input
                              type="password"
                              {...register('senha', { 
                                required: 'Senha é obrigatória',
                                minLength: {
                                  value: 6,
                                  message: 'A senha deve ter pelo menos 6 caracteres'
                                }
                              })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.senha && (
                              <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                              Confirmar Senha
                            </label>
                            <input
                              type="password"
                              {...register('confirmarSenha', {
                                required: 'Confirmação de senha é obrigatória',
                                validate: value => value === watch('senha') || 'As senhas não conferem'
                              })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.confirmarSenha && (
                              <p className="mt-1 text-sm text-red-600">{errors.confirmarSenha.message}</p>
                            )}
                          </div>
                        </>
                      )}

                      <div>
                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                          Tipo de Usuário
                        </label>
                        <select
                          {...register('tipo', { required: 'Tipo é obrigatório' })}
                          defaultValue={usuarioEditando?.tipo || TipoUsuario.ATENDENTE}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {isMasterAdmin() && (
                            <option value={TipoUsuario.MASTER_ADMIN}>Master Admin</option>
                          )}
                          <option value={TipoUsuario.ADMIN}>Administrador</option>
                          <option value={TipoUsuario.ATENDENTE}>Atendente</option>
                        </select>
                        {errors.tipo && (
                          <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
                        )}
                      </div>

                      {isMasterAdmin() && (
                        <div>
                          <label htmlFor="empresa_id" className="block text-sm font-medium text-gray-700">
                            Empresa
                          </label>
                          <select
                            {...register('empresa_id', { 
                              required: watch('tipo') !== TipoUsuario.MASTER_ADMIN ? 'Empresa é obrigatória' : false 
                            })}
                            defaultValue={usuarioEditando?.empresa_id}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Selecione uma empresa</option>
                            {empresas.map(empresa => (
                              <option key={empresa.id} value={empresa.id}>
                                {empresa.nome}
                              </option>
                            ))}
                          </select>
                          {errors.empresa_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.empresa_id.message}</p>
                          )}
                        </div>
                      )}

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {usuarioEditando ? 'Salvar' : 'Criar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setModalAberto(false);
                            reset();
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;