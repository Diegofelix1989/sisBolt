import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Search, X, Users, MapPin } from 'lucide-react';
import { Empresa, StatusAtivo } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface FormEmpresa {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

function Empresas() {
  const { isMasterAdmin } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState<Empresa | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormEmpresa>();
  
  // Verificar permissão
  if (!isMasterAdmin()) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Acesso Negado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Apenas Master Admins podem gerenciar empresas.
          </p>
        </div>
      </div>
    );
  }
  
  // Carregar empresas
  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const empresasMock: Empresa[] = [
          {
            id: 1,
            nome: 'Empresa Padrão',
            cnpj: '00.000.000/0001-00',
            email: 'contato@empresapadrao.com',
            telefone: '(11) 99999-9999',
            endereco: 'Rua das Empresas, 123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Tech Solutions Ltda',
            cnpj: '11.111.111/0001-11',
            email: 'contato@techsolutions.com',
            telefone: '(11) 88888-8888',
            endereco: 'Av. Tecnologia, 456',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '02345-678',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          },
          {
            id: 3,
            nome: 'Inovação Corp',
            cnpj: '22.222.222/0001-22',
            email: 'contato@inovacao.com',
            telefone: '(11) 77777-7777',
            endereco: 'Rua da Inovação, 789',
            cidade: 'Rio de Janeiro',
            estado: 'RJ',
            cep: '03456-789',
            status: StatusAtivo.INATIVO,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          }
        ];
        
        setEmpresas(empresasMock);
      } catch (error) {
        toast.error('Erro ao carregar empresas');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarEmpresas();
  }, []);

  // Filtrar empresas
  const empresasFiltradas = empresas.filter(empresa => 
    empresa.nome.toLowerCase().includes(busca.toLowerCase()) ||
    empresa.cnpj?.toLowerCase().includes(busca.toLowerCase()) ||
    empresa.email?.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar empresa
  const onSubmit = async (data: FormEmpresa) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (empresaEditando) {
        // Atualizar empresa existente
        const empresaAtualizada: Empresa = {
          ...empresaEditando,
          ...data,
          atualizado_em: new Date().toISOString()
        };

        setEmpresas(empresas.map(e => 
          e.id === empresaEditando.id ? empresaAtualizada : e
        ));
        
        toast.success('Empresa atualizada com sucesso!');
      } else {
        // Criar nova empresa
        const novaEmpresa: Empresa = {
          id: empresas.length + 1,
          ...data,
          status: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        };

        setEmpresas([...empresas, novaEmpresa]);
        toast.success('Empresa criada com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar empresa');
      console.error(error);
    }
  };

  // Excluir empresa
  const excluirEmpresa = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa? Todos os dados relacionados serão perdidos.')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmpresas(empresas.filter(e => e.id !== id));
      toast.success('Empresa excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir empresa');
      console.error(error);
    }
  };

  // Alternar status da empresa
  const alternarStatus = async (empresa: Empresa) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = empresa.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setEmpresas(empresas.map(e => 
        e.id === empresa.id 
          ? { ...e, status: novoStatus, atualizado_em: new Date().toISOString() }
          : e
      ));
      
      toast.success(`Empresa ${novoStatus === StatusAtivo.ATIVO ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da empresa');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Empresas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as empresas do sistema
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEmpresaEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
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
            placeholder="Buscar empresas..."
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

      {/* Lista de empresas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando empresas...</p>
          </div>
        ) : empresasFiltradas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {empresasFiltradas.map((empresa) => (
              <li key={empresa.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{empresa.nome}</p>
                        <p className="text-sm text-gray-500">
                          {empresa.cnpj} • {empresa.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {empresa.cidade}, {empresa.estado}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        empresa.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {empresa.status === StatusAtivo.ATIVO ? 'Ativa' : 'Inativa'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alternarStatus(empresa)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            empresa.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {empresa.status === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {empresa.status === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setEmpresaEditando(empresa);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirEmpresa(empresa.id)}
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
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma empresa encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando uma nova empresa.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar empresa */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {empresaEditando ? 'Editar Empresa' : 'Nova Empresa'}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                            Nome da Empresa
                          </label>
                          <input
                            type="text"
                            {...register('nome', { required: 'Nome é obrigatório' })}
                            defaultValue={empresaEditando?.nome}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.nome && (
                            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                            CNPJ
                          </label>
                          <input
                            type="text"
                            {...register('cnpj')}
                            defaultValue={empresaEditando?.cnpj}
                            placeholder="00.000.000/0001-00"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            {...register('email')}
                            defaultValue={empresaEditando?.email}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                            Telefone
                          </label>
                          <input
                            type="text"
                            {...register('telefone')}
                            defaultValue={empresaEditando?.telefone}
                            placeholder="(11) 99999-9999"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                            CEP
                          </label>
                          <input
                            type="text"
                            {...register('cep')}
                            defaultValue={empresaEditando?.cep}
                            placeholder="00000-000"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
                            Endereço
                          </label>
                          <input
                            type="text"
                            {...register('endereco')}
                            defaultValue={empresaEditando?.endereco}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                            Cidade
                          </label>
                          <input
                            type="text"
                            {...register('cidade')}
                            defaultValue={empresaEditando?.cidade}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                            Estado
                          </label>
                          <input
                            type="text"
                            {...register('estado')}
                            defaultValue={empresaEditando?.estado}
                            placeholder="SP"
                            maxLength={2}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {empresaEditando ? 'Salvar' : 'Criar'}
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

export default Empresas;