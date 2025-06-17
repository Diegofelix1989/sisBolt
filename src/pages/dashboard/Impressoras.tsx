import React, { useState, useEffect } from 'react';
import { Printer, Plus, Edit, Trash2, Search, X, Settings, Wifi, WifiOff } from 'lucide-react';
import { Impressora, Local, TipoImpressora, StatusAtivo } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormImpressora {
  nome: string;
  modelo: string;
  ip: string;
  porta: number;
  local_id: number;
  tipo: TipoImpressora;
  largura_colunas: number;
  cabecalho: string;
  rodape: string;
}

function Impressoras() {
  const [impressoras, setImpressoras] = useState<Impressora[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [impressoraEditando, setImpressoraEditando] = useState<Impressora | null>(null);
  const [busca, setBusca] = useState('');
  const [testando, setTestando] = useState<number | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormImpressora>();
  
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
        
        // Carregar impressoras
        const impressorasMock: Impressora[] = [
          {
            id: 1,
            nome: 'Impressora Tickets - Guichê 01',
            modelo: 'Epson TM-T20II',
            ip: '192.168.1.100',
            porta: 9100,
            local_id: 1,
            local: locaisMock[0],
            tipo: TipoImpressora.TICKET,
            largura_colunas: 40,
            cabecalho: 'SISTEMA DE FILAS\nUnidade Central',
            rodape: 'Aguarde sua chamada\nObrigado!',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Impressora Relatórios - Administração',
            modelo: 'HP LaserJet Pro',
            ip: '192.168.1.101',
            porta: 9100,
            local_id: 1,
            local: locaisMock[0],
            tipo: TipoImpressora.RELATORIO,
            largura_colunas: 80,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 3,
            nome: 'Impressora Geral - Recepção',
            modelo: 'Canon PIXMA',
            ip: '192.168.1.102',
            porta: 9100,
            local_id: 2,
            local: locaisMock[1],
            tipo: TipoImpressora.GERAL,
            largura_colunas: 60,
            status: StatusAtivo.INATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        setLocais(locaisMock);
        setImpressoras(impressorasMock);
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Filtrar impressoras
  const impressorasFiltradas = impressoras.filter(impressora => 
    impressora.nome.toLowerCase().includes(busca.toLowerCase()) ||
    impressora.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
    impressora.local?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar impressora
  const onSubmit = async (data: FormImpressora) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (impressoraEditando) {
        // Atualizar impressora existente
        const impressoraAtualizada: Impressora = {
          ...impressoraEditando,
          ...data,
          local: locais.find(l => l.id === data.local_id)
        };

        setImpressoras(impressoras => 
          impressoras.map(i => i.id === impressoraEditando.id ? impressoraAtualizada : i)
        );
        
        toast.success('Impressora atualizada com sucesso!');
      } else {
        // Criar nova impressora
        const novaImpressora: Impressora = {
          id: impressoras.length + 1,
          ...data,
          local: locais.find(l => l.id === data.local_id),
          status: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString()
        };

        setImpressoras([...impressoras, novaImpressora]);
        toast.success('Impressora criada com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar impressora');
      console.error(error);
    }
  };

  // Excluir impressora
  const excluirImpressora = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta impressora?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setImpressoras(impressoras => impressoras.filter(i => i.id !== id));
      toast.success('Impressora excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir impressora');
      console.error(error);
    }
  };

  // Alternar status da impressora
  const alternarStatus = async (impressora: Impressora) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = impressora.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setImpressoras(impressoras => 
        impressoras.map(i => 
          i.id === impressora.id 
            ? { ...i, status: novoStatus }
            : i
        )
      );
      
      toast.success(`Impressora ${novoStatus === StatusAtivo.ATIVO ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da impressora');
      console.error(error);
    }
  };

  // Testar impressora
  const testarImpressora = async (id: number) => {
    setTestando(id);
    
    try {
      // Simular teste de impressão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Teste de impressão enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao testar impressora');
      console.error(error);
    } finally {
      setTestando(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Impressoras</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as impressoras do sistema de filas
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setImpressoraEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Impressora
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
            placeholder="Buscar impressoras..."
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

      {/* Lista de impressoras */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando impressoras...</p>
          </div>
        ) : impressorasFiltradas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {impressorasFiltradas.map((impressora) => (
              <li key={impressora.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Printer className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{impressora.nome}</p>
                        <p className="text-sm text-gray-500">
                          {impressora.modelo} • {impressora.ip}:{impressora.porta}
                        </p>
                        <p className="text-xs text-gray-500">
                          {impressora.local?.nome} • {impressora.largura_colunas} colunas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        impressora.tipo === TipoImpressora.TICKET 
                          ? 'bg-blue-100 text-blue-800' 
                          : impressora.tipo === TipoImpressora.RELATORIO
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {impressora.tipo === TipoImpressora.TICKET ? 'Tickets' : 
                         impressora.tipo === TipoImpressora.RELATORIO ? 'Relatórios' : 'Geral'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        impressora.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {impressora.status === StatusAtivo.ATIVO ? (
                          <>
                            <Wifi className="h-3 w-3 mr-1" />
                            Online
                          </>
                        ) : (
                          <>
                            <WifiOff className="h-3 w-3 mr-1" />
                            Offline
                          </>
                        )}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => testarImpressora(impressora.id)}
                          disabled={testando === impressora.id || impressora.status === StatusAtivo.INATIVO}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {testando === impressora.id ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          ) : (
                            <Settings className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => alternarStatus(impressora)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            impressora.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {impressora.status === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {impressora.status === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setImpressoraEditando(impressora);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirImpressora(impressora.id)}
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
            <Printer className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma impressora encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando uma nova impressora.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar impressora */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Printer className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {impressoraEditando ? 'Editar Impressora' : 'Nova Impressora'}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                            Nome
                          </label>
                          <input
                            type="text"
                            {...register('nome', { required: 'Nome é obrigatório' })}
                            defaultValue={impressoraEditando?.nome}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.nome && (
                            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
                            Modelo
                          </label>
                          <input
                            type="text"
                            {...register('modelo')}
                            defaultValue={impressoraEditando?.modelo}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="local_id" className="block text-sm font-medium text-gray-700">
                            Local
                          </label>
                          <select
                            {...register('local_id', { required: 'Local é obrigatório' })}
                            defaultValue={impressoraEditando?.local_id}
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
                          <label htmlFor="ip" className="block text-sm font-medium text-gray-700">
                            Endereço IP
                          </label>
                          <input
                            type="text"
                            {...register('ip', { 
                              required: 'IP é obrigatório',
                              pattern: {
                                value: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
                                message: 'IP inválido'
                              }
                            })}
                            defaultValue={impressoraEditando?.ip}
                            placeholder="192.168.1.100"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.ip && (
                            <p className="mt-1 text-sm text-red-600">{errors.ip.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="porta" className="block text-sm font-medium text-gray-700">
                            Porta
                          </label>
                          <input
                            type="number"
                            {...register('porta', { 
                              required: 'Porta é obrigatória',
                              min: {
                                value: 1,
                                message: 'Porta deve ser maior que 0'
                              },
                              max: {
                                value: 65535,
                                message: 'Porta deve ser menor que 65536'
                              }
                            })}
                            defaultValue={impressoraEditando?.porta || 9100}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.porta && (
                            <p className="mt-1 text-sm text-red-600">{errors.porta.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                            Tipo
                          </label>
                          <select
                            {...register('tipo', { required: 'Tipo é obrigatório' })}
                            defaultValue={impressoraEditando?.tipo || TipoImpressora.TICKET}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value={TipoImpressora.TICKET}>Tickets</option>
                            <option value={TipoImpressora.RELATORIO}>Relatórios</option>
                            <option value={TipoImpressora.GERAL}>Geral</option>
                          </select>
                          {errors.tipo && (
                            <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="largura_colunas" className="block text-sm font-medium text-gray-700">
                            Largura (colunas)
                          </label>
                          <input
                            type="number"
                            {...register('largura_colunas', { 
                              required: 'Largura é obrigatória',
                              min: {
                                value: 20,
                                message: 'Largura deve ser maior que 20'
                              },
                              max: {
                                value: 120,
                                message: 'Largura deve ser menor que 120'
                              }
                            })}
                            defaultValue={impressoraEditando?.largura_colunas || 40}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.largura_colunas && (
                            <p className="mt-1 text-sm text-red-600">{errors.largura_colunas.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cabecalho" className="block text-sm font-medium text-gray-700">
                            Cabeçalho
                          </label>
                          <textarea
                            {...register('cabecalho')}
                            defaultValue={impressoraEditando?.cabecalho}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="rodape" className="block text-sm font-medium text-gray-700">
                            Rodapé
                          </label>
                          <textarea
                            {...register('rodape')}
                            defaultValue={impressoraEditando?.rodape}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {impressoraEditando ? 'Salvar' : 'Criar'}
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

export default Impressoras;