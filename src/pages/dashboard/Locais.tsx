import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { Local, StatusAtivo } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormLocal {
  nome: string;
  descricao: string;
}

function Locais() {
  const [locais, setLocais] = useState<Local[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [localEditando, setLocalEditando] = useState<Local | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormLocal>();
  
  // Carregar locais
  useEffect(() => {
    const carregarLocais = async () => {
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const locaisMock: Local[] = [
          {
            id: 1,
            nome: 'Unidade Central',
            descricao: 'Unidade principal de atendimento',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Filial Norte',
            descricao: 'Unidade da zona norte',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 3,
            nome: 'Filial Sul',
            descricao: 'Unidade da zona sul',
            status: StatusAtivo.INATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        setLocais(locaisMock);
      } catch (error) {
        toast.error('Erro ao carregar locais');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarLocais();
  }, []);

  // Filtrar locais
  const locaisFiltrados = locais.filter(local => 
    local.nome.toLowerCase().includes(busca.toLowerCase()) ||
    local.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar local
  const onSubmit = async (data: FormLocal) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (localEditando) {
        // Atualizar local existente
        const localAtualizado: Local = {
          ...localEditando,
          nome: data.nome,
          descricao: data.descricao
        };

        setLocais(locais.map(l => 
          l.id === localEditando.id ? localAtualizado : l
        ));
        
        toast.success('Local atualizado com sucesso!');
      } else {
        // Criar novo local
        const novoLocal: Local = {
          id: locais.length + 1,
          nome: data.nome,
          descricao: data.descricao,
          status: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString()
        };

        setLocais([...locais, novoLocal]);
        toast.success('Local criado com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar local');
      console.error(error);
    }
  };

  // Excluir local
  const excluirLocal = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este local?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLocais(locais.filter(l => l.id !== id));
      toast.success('Local excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir local');
      console.error(error);
    }
  };

  // Alternar status do local
  const alternarStatus = async (local: Local) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = local.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setLocais(locais.map(l => 
        l.id === local.id 
          ? { ...l, status: novoStatus }
          : l
      ));
      
      toast.success(`Local ${novoStatus === StatusAtivo.ATIVO ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do local');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Locais</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os locais de atendimento do sistema
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLocalEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Local
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
            placeholder="Buscar locais..."
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

      {/* Lista de locais */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando locais...</p>
          </div>
        ) : locaisFiltrados.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {locaisFiltrados.map((local) => (
              <li key={local.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{local.nome}</p>
                        <p className="text-sm text-gray-500">{local.descricao}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        local.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {local.status === StatusAtivo.ATIVO ? 'Ativo' : 'Inativo'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alternarStatus(local)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            local.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {local.status === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {local.status === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setLocalEditando(local);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirLocal(local.id)}
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
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum local encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando um novo local.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar local */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {localEditando ? 'Editar Local' : 'Novo Local'}
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
                          defaultValue={localEditando?.nome}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.nome && (
                          <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                          Descrição
                        </label>
                        <textarea
                          {...register('descricao')}
                          defaultValue={localEditando?.descricao}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {localEditando ? 'Salvar' : 'Criar'}
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

export default Locais;