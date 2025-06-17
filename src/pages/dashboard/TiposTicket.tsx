import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { TipoTicket, StatusAtivo } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormTipoTicket {
  nome: string;
  descricao: string;
  prioridade: number;
}

function TiposTicket() {
  const [tiposTicket, setTiposTicket] = useState<TipoTicket[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoTicketEditando, setTipoTicketEditando] = useState<TipoTicket | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormTipoTicket>();
  
  // Carregar tipos de ticket
  useEffect(() => {
    const carregarTiposTicket = async () => {
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const tiposTicketMock: TipoTicket[] = [
          {
            id: 1,
            nome: 'Normal',
            descricao: 'Atendimento padrão',
            prioridade: 1,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Preferencial',
            descricao: 'Atendimento prioritário',
            prioridade: 2,
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 3,
            nome: 'Emergencial',
            descricao: 'Atendimento urgente',
            prioridade: 3,
            status: StatusAtivo.INATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        setTiposTicket(tiposTicketMock);
      } catch (error) {
        toast.error('Erro ao carregar tipos de ticket');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarTiposTicket();
  }, []);

  // Filtrar tipos de ticket
  const tiposTicketFiltrados = tiposTicket.filter(tipo => 
    tipo.nome.toLowerCase().includes(busca.toLowerCase()) ||
    tipo.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar tipo de ticket
  const onSubmit = async (data: FormTipoTicket) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (tipoTicketEditando) {
        // Atualizar tipo existente
        const tipoAtualizado: TipoTicket = {
          ...tipoTicketEditando,
          nome: data.nome,
          descricao: data.descricao,
          prioridade: data.prioridade
        };

        setTiposTicket(tipos => 
          tipos.map(t => t.id === tipoTicketEditando.id ? tipoAtualizado : t)
        );
        
        toast.success('Tipo de ticket atualizado com sucesso!');
      } else {
        // Criar novo tipo
        const novoTipo: TipoTicket = {
          id: tiposTicket.length + 1,
          nome: data.nome,
          descricao: data.descricao,
          prioridade: data.prioridade,
          status: StatusAtivo.ATIVO,
          criado_em: new Date().toISOString()
        };

        setTiposTicket([...tiposTicket, novoTipo]);
        toast.success('Tipo de ticket criado com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar tipo de ticket');
      console.error(error);
    }
  };

  // Excluir tipo de ticket
  const excluirTipoTicket = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este tipo de ticket?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTiposTicket(tipos => tipos.filter(t => t.id !== id));
      toast.success('Tipo de ticket excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tipo de ticket');
      console.error(error);
    }
  };

  // Alternar status do tipo de ticket
  const alternarStatus = async (tipo: TipoTicket) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = tipo.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setTiposTicket(tipos => 
        tipos.map(t => 
          t.id === tipo.id 
            ? { ...t, status: novoStatus }
            : t
        )
      );
      
      toast.success(`Tipo de ticket ${novoStatus === StatusAtivo.ATIVO ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do tipo de ticket');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tipos de Ticket</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os tipos de ticket e suas prioridades
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTipoTicketEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
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
            placeholder="Buscar tipos de ticket..."
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

      {/* Lista de tipos de ticket */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando tipos de ticket...</p>
          </div>
        ) : tiposTicketFiltrados.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tiposTicketFiltrados.map((tipo) => (
              <li key={tipo.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Tag className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{tipo.nome}</p>
                        <p className="text-sm text-gray-500">{tipo.descricao}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Prioridade {tipo.prioridade}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tipo.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tipo.status === StatusAtivo.ATIVO ? 'Ativo' : 'Inativo'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alternarStatus(tipo)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            tipo.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">
                            {tipo.status === StatusAtivo.ATIVO ? 'Desativar' : 'Ativar'}
                          </span>
                          {tipo.status === StatusAtivo.ATIVO ? '🚫' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            setTipoTicketEditando(tipo);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirTipoTicket(tipo.id)}
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
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum tipo de ticket encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando um novo tipo de ticket.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar tipo de ticket */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {tipoTicketEditando ? 'Editar Tipo de Ticket' : 'Novo Tipo de Ticket'}
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
                          defaultValue={tipoTicketEditando?.nome}
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
                          defaultValue={tipoTicketEditando?.descricao}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">
                          Prioridade
                        </label>
                        <input
                          type="number"
                          {...register('prioridade', { 
                            required: 'Prioridade é obrigatória',
                            min: {
                              value: 1,
                              message: 'Prioridade deve ser maior que 0'
                            }
                          })}
                          defaultValue={tipoTicketEditando?.prioridade || 1}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.prioridade && (
                          <p className="mt-1 text-sm text-red-600">{errors.prioridade.message}</p>
                        )}
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {tipoTicketEditando ? 'Salvar' : 'Criar'}
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

export default TiposTicket;