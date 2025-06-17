import React, { useState, useEffect } from 'react';
import { List, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { Fila, Local, TipoTicket, StatusAtivo, ResetTicket } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormFila {
  nome: string;
  tipo_ticket_id: number;
  prefixo: string;
  tamanho_ticket: number;
  local_id: number;
  reset_ticket: ResetTicket;
}

function Filas() {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [tiposTicket, setTiposTicket] = useState<TipoTicket[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [filaEditando, setFilaEditando] = useState<Fila | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFila>();
  
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
        
        // Carregar tipos de ticket
        const tiposTicketMock: TipoTicket[] = [
          {
            id: 1,
            nome: 'Normal',
            prioridade: 1,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Preferencial',
            prioridade: 2,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        // Carregar filas
        const filasMock: Fila[] = [
          {
            id: 1,
            nome: 'Atendimento Geral',
            tipo_ticket_id: 1,
            tipo_ticket: tiposTicketMock[0],
            prefixo: 'G',
            tamanho_ticket: 3,
            local_id: 1,
            local: locaisMock[0],
            reset_ticket: ResetTicket.DIARIO,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Preferencial',
            tipo_ticket_id: 2,
            tipo_ticket: tiposTicketMock[1],
            prefixo: 'P',
            tamanho_ticket: 3,
            local_id: 1,
            local: locaisMock[0],
            reset_ticket: ResetTicket.DIARIO,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        setLocais(locaisMock);
        setTiposTicket(tiposTicketMock);
        setFilas(filasMock);
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Filtrar filas
  const filasFiltradas = filas.filter(fila => 
    fila.nome.toLowerCase().includes(busca.toLowerCase()) ||
    fila.prefixo.toLowerCase().includes(busca.toLowerCase()) ||
    fila.local?.nome.toLowerCase().includes(busca.toLowerCase()) ||
    fila.tipo_ticket?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar fila
  const onSubmit = async (data: FormFila) => {
    try {
      // Validar prefixo
      if (data.prefixo.length > 3) {
        toast.error('Prefixo deve ter no máximo 3 caracteres');
        return;
      }

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (filaEditando) {
        // Atualizar fila existente
        const filaAtualizada: Fila = {
          ...filaEditando,
          ...data,
          tipo_ticket: tiposTicket.find(t => t.id === data.tipo_ticket_id),
          local: locais.find(l => l.id === data.local_id)
        };

        setFilas(filas => 
          filas.map(f => f.id === filaEditando.id ? filaAtualizada : f)
        );
        
        toast.success('Fila atualizada com sucesso!');
      } else {
        // Criar nova fila
        const novaFila: Fila = {
          id: filas.length + 1,
          ...data,
          tipo_ticket: tiposTicket.find(t => t.id === data.tipo_ticket_id),
          local: locais.find(l => l.id === data.local_id),
          status: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString()
        };

        setFilas([...filas, novaFila]);
        toast.success('Fila criada com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar fila');
      console.error(error);
    }
  };

  // Excluir fila
  const excluirFila = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta fila?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFilas(filas => filas.filter(f => f.id !== id));
      toast.success('Fila excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir fila');
      console.error(error);
    }
  };

  // Alternar status da fila
  const alternarStatus = async (fila: Fila) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = fila.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setFilas(filas => 
        filas.map(f => 
          f.id === fila.id 
            ? { ...f, status: novoStatus }
            : f
        )
      );
      
      toast.success(`Fila ${novoStatus === StatusAtivo.ATIVO ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da fila');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Filas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as filas de atendimento do sistema
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFilaEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Fila
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
            placeholder="Buscar filas..."
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

      {/* Lista de filas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando filas...</p>
          </div>
        ) : filasFiltradas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filasFiltradas.map((fila) => (
              <li key={fila.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <List className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{fila.nome}</p>
                        <p className="text-sm text-gray-500">
                          {fila.local?.nome} • {fila.tipo_ticket?.nome}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Prefixo: {fila.prefixo}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        fila.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fila.status === StatusAtivo.ATIVO ? 'Ativa' : 'Inativa'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alternarStatus(fila)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            fila.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {fila.status === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {fila.status === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setFilaEditando(fila);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirFila(fila.id)}
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
            <List className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma fila encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando uma nova fila.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar fila */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <List className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {filaEditando ? 'Editar Fila' : 'Nova Fila'}
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
                          defaultValue={filaEditando?.nome}
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
                          defaultValue={filaEditando?.local_id}
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
                        <label htmlFor="tipo_ticket_id" className="block text-sm font-medium text-gray-700">
                          Tipo de Ticket
                        </label>
                        <select
                          {...register('tipo_ticket_id', { required: 'Tipo de ticket é obrigatório' })}
                          defaultValue={filaEditando?.tipo_ticket_id}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Selecione um tipo</option>
                          {tiposTicket.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nome}
                            </option>
                          ))}
                        </select>
                        {errors.tipo_ticket_id && (
                          <p className="mt-1 text-sm text-red-600">{errors.tipo_ticket_id.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="prefixo" className="block text-sm font-medium text-gray-700">
                            Prefixo
                          </label>
                          <input
                            type="text"
                            {...register('prefixo', { 
                              required: 'Prefixo é obrigatório',
                              maxLength: {
                                value: 3,
                                message: 'Prefixo deve ter no máximo 3 caracteres'
                              }
                            })}
                            defaultValue={filaEditando?.prefixo}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.prefixo && (
                            <p className="mt-1 text-sm text-red-600">{errors.prefixo.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="tamanho_ticket" className="block text-sm font-medium text-gray-700">
                            Tamanho do Ticket
                          </label>
                          <input
                            type="number"
                            {...register('tamanho_ticket', { 
                              required: 'Tamanho é obrigatório',
                              min: {
                                value: 1,
                                message: 'Tamanho deve ser maior que 0'
                              },
                              max: {
                                value: 6,
                                message: 'Tamanho deve ser no máximo 6'
                              }
                            })}
                            defaultValue={filaEditando?.tamanho_ticket || 3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.tamanho_ticket && (
                            <p className="mt-1 text-sm text-red-600">{errors.tamanho_ticket.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reset_ticket" className="block text-sm font-medium text-gray-700">
                          Reset de Numeração
                        </label>
                        <select
                          {...register('reset_ticket', { required: 'Reset é obrigatório' })}
                          defaultValue={filaEditando?.reset_ticket || ResetTicket.DIARIO}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value={ResetTicket.NUNCA}>Nunca</option>
                          <option value={ResetTicket.DIARIO}>Diário</option>
                          <option value={ResetTicket.SEMANAL}>Semanal</option>
                          <option value={ResetTicket.MENSAL}>Mensal</option>
                          <option value={ResetTicket.ANUAL}>Anual</option>
                          <option value={ResetTicket.MANUAL}>Manual</option>
                        </select>
                        {errors.reset_ticket && (
                          <p className="mt-1 text-sm text-red-600">{errors.reset_ticket.message}</p>
                        )}
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {filaEditando ? 'Salvar' : 'Criar'}
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

export default Filas;