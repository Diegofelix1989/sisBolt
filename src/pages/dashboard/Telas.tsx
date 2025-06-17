import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Edit, Trash2, Search, X, Eye } from 'lucide-react';
import { Tela, Local, TipoExibicao, StatusAtivo } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormTela {
  nome: string;
  local_id: number;
  tipo_exibicao: TipoExibicao;
}

function Telas() {
  const [telas, setTelas] = useState<Tela[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [telaEditando, setTelaEditando] = useState<Tela | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormTela>();
  
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
        
        // Carregar telas
        const telasMock: Tela[] = [
          {
            id: 1,
            nome: 'Painel Principal',
            local_id: 1,
            local: locaisMock[0],
            tipo_exibicao: TipoExibicao.AMBOS,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Painel Secundário',
            local_id: 1,
            local: locaisMock[0],
            tipo_exibicao: TipoExibicao.TICKETS,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        setLocais(locaisMock);
        setTelas(telasMock);
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Filtrar telas
  const telasFiltradas = telas.filter(tela => 
    tela.nome.toLowerCase().includes(busca.toLowerCase()) ||
    tela.local?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar tela
  const onSubmit = async (data: FormTela) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (telaEditando) {
        // Atualizar tela existente
        const telaAtualizada: Tela = {
          ...telaEditando,
          ...data,
          local: locais.find(l => l.id === data.local_id)
        };

        setTelas(telas => 
          telas.map(t => t.id === telaEditando.id ? telaAtualizada : t)
        );
        
        toast.success('Tela atualizada com sucesso!');
      } else {
        // Criar nova tela
        const novaTela: Tela = {
          id: telas.length + 1,
          ...data,
          local: locais.find(l => l.id === data.local_id),
          status: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString()
        };

        setTelas([...telas, novaTela]);
        toast.success('Tela criada com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar tela');
      console.error(error);
    }
  };

  // Excluir tela
  const excluirTela = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta tela?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTelas(telas => telas.filter(t => t.id !== id));
      toast.success('Tela excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tela');
      console.error(error);
    }
  };

  // Alternar status da tela
  const alternarStatus = async (tela: Tela) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = tela.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setTelas(telas => 
        telas.map(t => 
          t.id === tela.id 
            ? { ...t, status: novoStatus }
            : t
        )
      );
      
      toast.success(`Tela ${novoStatus === StatusAtivo.ATIVO ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da tela');
      console.error(error);
    }
  };

  // Abrir tela em nova aba
  const abrirTela = (id: number) => {
    window.open(`/painel/${id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Telas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as telas de exibição do sistema
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTelaEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Tela
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
            placeholder="Buscar telas..."
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

      {/* Lista de telas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando telas...</p>
          </div>
        ) : telasFiltradas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {telasFiltradas.map((tela) => (
              <li key={tela.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Monitor className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{tela.nome}</p>
                        <p className="text-sm text-gray-500">{tela.local?.nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tela.tipo_exibicao === TipoExibicao.TICKETS ? 'Apenas Tickets' : 
                         tela.tipo_exibicao === TipoExibicao.PUBLICIDADE ? 'Apenas Publicidade' : 
                         'Tickets e Publicidade'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tela.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tela.status === StatusAtivo.ATIVO ? 'Ativa' : 'Inativa'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => abrirTela(tela.id)}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alternarStatus(tela)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            tela.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {tela.status === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {tela.status === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setTelaEditando(tela);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirTela(tela.id)}
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
            <Monitor className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma tela encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando uma nova tela.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar tela */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Monitor className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {telaEditando ? 'Editar Tela' : 'Nova Tela'}
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
                          defaultValue={telaEditando?.nome}
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
                          defaultValue={telaEditando?.local_id}
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

                      <div>
                        <label htmlFor="tipo_exibicao" className="block text-sm font-medium text-gray-700">
                          Tipo de Exibição
                        </label>
                        <select
                          {...register('tipo_exibicao', { required: 'Tipo de exibição é obrigatório' })}
                          defaultValue={telaEditando?.tipo_exibicao || TipoExibicao.TICKETS}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value={TipoExibicao.TICKETS}>Apenas Tickets</option>
                          <option value={TipoExibicao.PUBLICIDADE}>Apenas Publicidade</option>
                          <option value={TipoExibicao.AMBOS}>Tickets e Publicidade</option>
                        </select>
                        {errors.tipo_exibicao && (
                          <p className="mt-1 text-sm text-red-600">{errors.tipo_exibicao.message}</p>
                        )}
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {telaEditando ? 'Salvar' : 'Criar'}
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

export default Telas;