import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserCheck, Bell, ArrowRightCircle, CheckCircle, XCircle, 
  Printer, Megaphone, Clock, RefreshCw, List, Users, 
  Play, Pause, SkipForward, AlertCircle, Volume2, VolumeX,
  Settings, BarChart3, Timer, User
} from 'lucide-react';
import { StatusTicket, Ticket, Guiche, Fila } from '../../types';
import { classNames } from '../../utils/classNames';
import { formatarDataHora } from '../../utils/formatadores';

const Atendimento: React.FC = () => {
  const { usuario } = useAuth();
  const [guicheAtual, setGuicheAtual] = useState<Guiche | null>(null);
  const [ticketAtual, setTicketAtual] = useState<Ticket | null>(null);
  const [filaTickets, setFilaTickets] = useState<Ticket[]>([]);
  const [historicoTickets, setHistoricoTickets] = useState<Ticket[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [filasDisponiveis, setFilasDisponiveis] = useState<Fila[]>([]);
  const [filtroFila, setFiltroFila] = useState<string>('todos');
  const [somAtivado, setSomAtivado] = useState(true);
  const [pausado, setPausado] = useState(false);
  const [tempoAtendimento, setTempoAtendimento] = useState<number>(0);
  const [estatisticasDia, setEstatisticasDia] = useState({
    atendidos: 0,
    cancelados: 0,
    tempoMedio: 0,
    naFila: 0
  });

  // Timer para tempo de atendimento
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    
    if (ticketAtual && ticketAtual.status === StatusTicket.EM_ATENDIMENTO) {
      intervalo = setInterval(() => {
        const inicio = new Date(ticketAtual.atendimento_iniciado_em || ticketAtual.chamado_em || '').getTime();
        const agora = new Date().getTime();
        setTempoAtendimento(Math.floor((agora - inicio) / 1000));
      }, 1000);
    } else {
      setTempoAtendimento(0);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [ticketAtual]);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Configurar guichê atual
      setGuicheAtual({
        id: 1,
        nome: 'Guichê 01',
        local_id: 1,
        local: {
          id: 1,
          nome: 'Unidade Central',
          status: 'ativo',
          criado_em: new Date().toISOString()
        },
        status_uso: 'em_uso',
        status_ativo: 'ativo',
        criado_em: new Date().toISOString()
      });
      
      // Carregar filas disponíveis
      const filas: Fila[] = [
        {
          id: 1,
          nome: 'Prioritário',
          tipo_ticket_id: 1,
          prefixo: 'P',
          tamanho_ticket: 3,
          local_id: 1,
          reset_ticket: 'diario',
          status: 'ativo',
          criado_em: new Date().toISOString()
        },
        {
          id: 2,
          nome: 'Comum',
          tipo_ticket_id: 2,
          prefixo: 'C',
          tamanho_ticket: 3,
          local_id: 1,
          reset_ticket: 'diario',
          status: 'ativo',
          criado_em: new Date().toISOString()
        },
        {
          id: 3,
          nome: 'Empresarial',
          tipo_ticket_id: 3,
          prefixo: 'E',
          tamanho_ticket: 3,
          local_id: 1,
          reset_ticket: 'diario',
          status: 'ativo',
          criado_em: new Date().toISOString()
        }
      ];
      
      setFilasDisponiveis(filas);
      
      // Carregar fila de tickets
      setFilaTickets([
        {
          id: 1,
          numero: 1,
          fila_id: 1,
          fila: filas[0],
          status: StatusTicket.AGUARDANDO,
          criado_em: new Date(Date.now() - 15 * 60000).toISOString(),
          ticket_completo: 'P001'
        },
        {
          id: 2,
          numero: 2,
          fila_id: 1,
          fila: filas[0],
          status: StatusTicket.AGUARDANDO,
          criado_em: new Date(Date.now() - 10 * 60000).toISOString(),
          ticket_completo: 'P002'
        },
        {
          id: 3,
          numero: 1,
          fila_id: 2,
          fila: filas[1],
          status: StatusTicket.AGUARDANDO,
          criado_em: new Date(Date.now() - 30 * 60000).toISOString(),
          ticket_completo: 'C001'
        },
        {
          id: 4,
          numero: 2,
          fila_id: 2,
          fila: filas[1],
          status: StatusTicket.AGUARDANDO,
          criado_em: new Date(Date.now() - 25 * 60000).toISOString(),
          ticket_completo: 'C002'
        },
        {
          id: 5,
          numero: 1,
          fila_id: 3,
          fila: filas[2],
          status: StatusTicket.AGUARDANDO,
          criado_em: new Date(Date.now() - 20 * 60000).toISOString(),
          ticket_completo: 'E001'
        }
      ]);
      
      // Carregar histórico
      setHistoricoTickets([
        {
          id: 101,
          numero: 1,
          fila_id: 1,
          fila: filas[0],
          status: StatusTicket.ATENDIDO,
          chamado_por: usuario?.id,
          chamado_em: new Date(Date.now() - 40 * 60000).toISOString(),
          atendimento_iniciado_em: new Date(Date.now() - 38 * 60000).toISOString(),
          atendimento_finalizado_em: new Date(Date.now() - 25 * 60000).toISOString(),
          guiche_id: 1,
          criado_em: new Date(Date.now() - 50 * 60000).toISOString(),
          ticket_completo: 'P001'
        },
        {
          id: 102,
          numero: 1,
          fila_id: 2,
          fila: filas[1],
          status: StatusTicket.CANCELADO,
          chamado_por: usuario?.id,
          chamado_em: new Date(Date.now() - 70 * 60000).toISOString(),
          guiche_id: 1,
          criado_em: new Date(Date.now() - 85 * 60000).toISOString(),
          ticket_completo: 'C001'
        }
      ]);
      
      // Estatísticas do dia
      setEstatisticasDia({
        atendidos: 12,
        cancelados: 2,
        tempoMedio: 15,
        naFila: 5
      });
      
      setCarregando(false);
    };
    
    carregarDados();
  }, [usuario]);

  // Filtrar tickets por fila
  const ticketsParaExibir = filtroFila === 'todos' 
    ? filaTickets 
    : filaTickets.filter(ticket => ticket.fila?.id.toString() === filtroFila);

  // Chamar próximo ticket
  const chamarProximo = () => {
    if (pausado) {
      alert('Você está pausado! Retome o atendimento primeiro.');
      return;
    }

    if (ticketAtual && ticketAtual.status === StatusTicket.EM_ATENDIMENTO) {
      alert('Finalize o atendimento atual antes de chamar o próximo!');
      return;
    }
    
    if (filaTickets.length > 0) {
      // Priorizar tickets por ordem de prioridade das filas
      const ticketsPrioritarios = filaTickets.filter(t => t.fila?.nome === 'Prioritário');
      const proximo = ticketsPrioritarios.length > 0 ? ticketsPrioritarios[0] : filaTickets[0];
      
      const ticketChamado: Ticket = {
        ...proximo,
        status: StatusTicket.EM_ATENDIMENTO,
        chamado_por: usuario?.id,
        chamado_em: new Date().toISOString(),
        atendimento_iniciado_em: new Date().toISOString(),
        guiche_id: guicheAtual?.id
      };
      
      setTicketAtual(ticketChamado);
      setFilaTickets(filaTickets.filter(t => t.id !== proximo.id));
      
      // Reproduzir som de chamada
      if (somAtivado) {
        // Em produção, reproduzir som
        console.log('🔊 Chamando ticket:', ticketChamado.ticket_completo);
      }
    } else {
      alert('Não há tickets na fila!');
    }
  };

  // Chamar ticket específico
  const chamarTicketEspecifico = (ticket: Ticket) => {
    if (pausado) {
      alert('Você está pausado! Retome o atendimento primeiro.');
      return;
    }

    if (ticketAtual && ticketAtual.status === StatusTicket.EM_ATENDIMENTO) {
      alert('Finalize o atendimento atual antes de chamar outro!');
      return;
    }
    
    const ticketChamado: Ticket = {
      ...ticket,
      status: StatusTicket.EM_ATENDIMENTO,
      chamado_por: usuario?.id,
      chamado_em: new Date().toISOString(),
      atendimento_iniciado_em: new Date().toISOString(),
      guiche_id: guicheAtual?.id
    };
    
    setTicketAtual(ticketChamado);
    setFilaTickets(filaTickets.filter(t => t.id !== ticket.id));
  };

  // Finalizar atendimento atual
  const finalizarAtendimento = () => {
    if (!ticketAtual) {
      alert('Nenhum ticket em atendimento!');
      return;
    }
    
    const ticketFinalizado: Ticket = {
      ...ticketAtual,
      status: StatusTicket.ATENDIDO,
      atendimento_finalizado_em: new Date().toISOString()
    };
    
    setHistoricoTickets([ticketFinalizado, ...historicoTickets]);
    setTicketAtual(null);
    setTempoAtendimento(0);
    
    // Atualizar estatísticas
    setEstatisticasDia(prev => ({
      ...prev,
      atendidos: prev.atendidos + 1
    }));
  };

  // Cancelar atendimento atual
  const cancelarAtendimento = () => {
    if (!ticketAtual) {
      alert('Nenhum ticket em atendimento!');
      return;
    }
    
    const ticketCancelado: Ticket = {
      ...ticketAtual,
      status: StatusTicket.CANCELADO,
      atendimento_finalizado_em: new Date().toISOString()
    };
    
    setHistoricoTickets([ticketCancelado, ...historicoTickets]);
    setTicketAtual(null);
    setTempoAtendimento(0);
    
    // Atualizar estatísticas
    setEstatisticasDia(prev => ({
      ...prev,
      cancelados: prev.cancelados + 1
    }));
  };

  // Rechamar ticket atual
  const rechamarTicket = () => {
    if (!ticketAtual) {
      alert('Nenhum ticket em atendimento!');
      return;
    }
    
    if (somAtivado) {
      console.log('🔊 Rechamando ticket:', ticketAtual.ticket_completo);
    }
    
    alert(`Ticket ${ticketAtual.ticket_completo} rechamado!`);
  };

  // Pausar/Retomar atendimento
  const alternarPausa = () => {
    setPausado(!pausado);
  };

  // Alternar som
  const alternarSom = () => {
    setSomAtivado(!somAtivado);
  };

  // Formatar tempo em MM:SS
  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do atendimento */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                pausado ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <UserCheck className={`h-6 w-6 ${pausado ? 'text-red-600' : 'text-green-600'}`} />
              </div>
            </div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                {guicheAtual?.nome} - {usuario?.nome}
                {pausado && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Pause className="w-3 h-3 mr-1" />
                    Pausado
                  </span>
                )}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {guicheAtual?.local?.nome} • {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Controles de som e pausa */}
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                somAtivado ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-white'
              } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={alternarSom}
            >
              {somAtivado ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
              {somAtivado ? 'Som On' : 'Som Off'}
            </button>
            
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                pausado ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={alternarPausa}
            >
              {pausado ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {pausado ? 'Retomar' : 'Pausar'}
            </button>
            
            {/* Filtro de filas */}
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filtroFila}
              onChange={(e) => setFiltroFila(e.target.value)}
            >
              <option value="todos">Todas as filas</option>
              {filasDisponiveis.map((fila) => (
                <option key={fila.id} value={fila.id.toString()}>{fila.nome}</option>
              ))}
            </select>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={chamarProximo}
              disabled={carregando || filaTickets.length === 0 || pausado || (ticketAtual?.status === StatusTicket.EM_ATENDIMENTO)}
            >
              <Bell className="h-4 w-4 mr-2" /> 
              Chamar Próximo
            </button>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seção esquerda - Ticket atual e estatísticas */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ticket em atendimento */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg leading-6 font-medium text-blue-900 flex items-center">
                <UserCheck className="mr-2 h-6 w-6" />
                Atendimento Atual
                {ticketAtual && (
                  <span className="ml-2 text-sm font-normal text-blue-700">
                    ({formatarTempo(tempoAtendimento)})
                  </span>
                )}
              </h3>
            </div>
            
            {ticketAtual ? (
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-300">
                    <span className="text-3xl font-bold text-blue-800">{ticketAtual.ticket_completo}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Fila</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">{ticketAtual.fila?.nome}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Tempo</div>
                    <div className="mt-1 text-lg font-medium text-gray-900 flex items-center justify-center">
                      <Timer className="h-4 w-4 mr-1" />
                      {formatarTempo(tempoAtendimento)}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500">Observações</div>
                  <div className="mt-1 text-gray-900 border border-gray-200 rounded-md p-3 bg-gray-50 min-h-[60px]">
                    {ticketAtual.observacao || 'Sem observações'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={finalizarAtendimento}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" /> Finalizar
                  </button>
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={cancelarAtendimento}
                  >
                    <XCircle className="h-5 w-5 mr-2" /> Cancelar
                  </button>
                </div>
                
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={rechamarTicket}
                >
                  <Megaphone className="h-5 w-5 mr-2" /> Rechamar
                </button>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum ticket em atendimento</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {pausado ? 'Você está pausado. Clique em "Retomar" para continuar.' : 'Clique em "Chamar Próximo" para iniciar um novo atendimento.'}
                </p>
              </div>
            )}
          </div>
          
          {/* Estatísticas do dia */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg leading-6 font-medium text-blue-900 flex items-center">
                <BarChart3 className="mr-2 h-6 w-6" />
                Estatísticas do Dia
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium text-green-700">Atendidos</div>
                  <div className="mt-1 text-2xl font-semibold text-green-600">{estatisticasDia.atendidos}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium text-blue-700">Tempo Médio</div>
                  <div className="mt-1 text-2xl font-semibold text-blue-600">{estatisticasDia.tempoMedio} min</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium text-red-700">Cancelados</div>
                  <div className="mt-1 text-2xl font-semibold text-red-600">{estatisticasDia.cancelados}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium text-yellow-700">Na Fila</div>
                  <div className="mt-1 text-2xl font-semibold text-yellow-600">{filaTickets.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção direita - Lista de tickets e histórico */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fila de tickets */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-blue-900 flex items-center">
                <List className="mr-2 h-6 w-6" />
                Fila de Tickets ({ticketsParaExibir.length})
              </h3>
              <button
                type="button"
                className="inline-flex items-center p-1.5 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  // Em produção, recarregar dados da API
                  alert('Recarregar fila');
                }}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            
            {ticketsParaExibir.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fila
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chegada
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tempo de Espera
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ticketsParaExibir.map((ticket, index) => (
                      <tr key={ticket.id} className={index === 0 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{ticket.ticket_completo}</span>
                            {index === 0 && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Próximo
                              </span>
                            )}
                            {ticket.fila?.nome === 'Prioritário' && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Prioritário
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.fila?.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ticket.criado_em).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.floor((Date.now() - new Date(ticket.criado_em).getTime()) / 60000)} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => chamarTicketEspecifico(ticket)}
                            disabled={!!ticketAtual && ticketAtual.status === StatusTicket.EM_ATENDIMENTO || pausado}
                          >
                            <ArrowRightCircle className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Fila vazia</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há tickets aguardando atendimento.
                </p>
              </div>
            )}
          </div>
          
          {/* Histórico de atendimentos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg leading-6 font-medium text-blue-900 flex items-center">
                <Clock className="mr-2 h-6 w-6" />
                Histórico de Atendimentos
              </h3>
            </div>
            
            {historicoTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fila
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chamado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concluído
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historicoTickets.slice(0, 10).map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ticket.ticket_completo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.fila?.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={classNames(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            ticket.status === StatusTicket.ATENDIDO 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          )}>
                            {ticket.status === StatusTicket.ATENDIDO ? 'Atendido' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ticket.chamado_em || '').toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.atendimento_finalizado_em && new Date(ticket.atendimento_finalizado_em).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum atendimento registrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Seu histórico de atendimentos aparecerá aqui.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atendimento;