import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Search, X, MapPin, User } from 'lucide-react';
import { Guiche, Local, StatusUsoGuiche, StatusAtivo } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormGuiche {
  nome: string;
  local_id: number;
}

function Guiches() {
  const [guiches, setGuiches] = useState<Guiche[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [guicheEditando, setGuicheEditando] = useState<Guiche | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormGuiche>();
  
  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar locais
        const locaisMock: Local[] = [
          {
            id: 1,
            nome: 'Unidade Central',
            descricao: 'Unidade principal',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Filial Norte',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        // Carregar guichês
        const guichesMock: Guiche[] = [
          {
            id: 1,
            nome: 'Guichê 01',
            local_id: 1,
            local: locaisMock[0],
            status_uso: StatusUsoGuiche.EM_USO,
            status_ativo: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Guichê 02',
            local_id: 1,
            local: locaisMock[0],
            status_uso: StatusUsoGuiche.DISPONIVEL,
            status_ativo: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 3,
            nome: 'Guichê 03',
            local_id: 1,
            local: locaisMock[0],
            status_uso: StatusUsoGuiche.DISPONIVEL,
            status_ativo: StatusAtivo.INATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        setLocais(locaisMock);
        setGuiches(guichesMock);
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Filtrar guichês
  const guichesFiltrados = guiches.filter(guiche => 
    guiche.nome.toLowerCase().includes(busca.toLowerCase()) ||
    guiche.local?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar guichê
  const onSubmit = async (data: FormGuiche) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (guicheEditando) {
        // Atualizar guichê existente
        const guicheAtualizado: Guiche = {
          ...guicheEditando,
          ...data,
          local: locais.find(l => l.id === data.local_id)
        };

        setGuiches(guiches => 
          guiches.map(g => g.id === guicheEditando.id ? guicheAtualizado : g)
        );
        
        toast.success('Guichê atualizado com sucesso!');
      } else {
        // Criar novo guichê
        const novoGuiche: Guiche = {
          id: guiches.length + 1,
          ...data,
          local: locais.find(l => l.id === data.local_id),
          status_uso: StatusUsoGuiche.DISPONIVEL,
          status_ativo: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString()
        };

        setGuiches([...guiches, novoGuiche]);
        toast.success('Guichê criado com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar guichê');
      console.error(error);
    }
  };

  // Excluir guichê
  const excluirGuiche = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este guichê?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGuiches(guiches => guiches.filter(g => g.id !== id));
      toast.success('Guichê excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir guichê');
      console.error(error);
    }
  };

  // Alternar status do guichê
  const alternarStatus = async (guiche: Guiche) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = guiche.status_ativo === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setGuiches(guiches => 
        guiches.map(g => 
          g.id === guiche.id 
            ? { ...g, status_ativo: novoStatus }
            : g
        )
      );
      
      toast.success(`Guichê ${novoStatus === StatusAtivo.ATIVO ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do guichê');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Guichês</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os guichês de atendimento do sistema
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setGuicheEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Guichê
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
            placeholder="Buscar guichês..."
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

      {/* Lista de guichês */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando guichês...</p>
          </div>
        ) : guichesFiltrados.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {guichesFiltrados.map((guiche) => (
              <li key={guiche.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{guiche.nome}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {guiche.local?.nome}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        guiche.status_uso === StatusUsoGuiche.EM_USO 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {guiche.status_uso === StatusUsoGuiche.EM_USO ? 'Em Uso' : 'Disponível'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        guiche.status_ativo === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {guiche.status_ativo === StatusAtivo.ATIVO ? 'Ativo' : 'Inativo'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alternarStatus(guiche)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            guiche.status_ativo === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {guiche.status_ativo === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {guiche.status_ativo === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setGuicheEditando(guiche);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirGuiche(guiche.id)}
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
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum guichê encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando um novo guichê.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar guichê */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {guicheEditando ? 'Editar Guichê' : 'Novo Guichê'}
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
                          defaultValue={guicheEditando?.nome}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.nome && (
                          <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="local_id" className="block text-sm font-medium text-gray-700">
                          Local
                        </label>
                        <select
                          {...register('local_id', { required: 'Local é obrigatório' })}
                          defaultValue={guicheEditando?.local_id}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Selecione um local</option>
                          {locais.map(local => (
                            <option key={local.id} value={local.id}>
                              {local.nome}
                            </option>
                          ))}
                        </select>
                        {errors.local_id && (
                          <p className="mt-1 text-sm text-red-600">{errors.local_id.message}</p>
                        )}
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {guicheEditando ? 'Salvar' : 'Criar'}
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

export default Guiches;