import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Volume2, VolumeX, Clock, Play, Pause, Maximize, Minimize } from 'lucide-react';
import { Tela, Ticket, Publicidade } from '../../types';
import { formatarDataHora } from '../../utils/formatadores';

const PainelChamada: React.FC = () => {
  const { telaId } = useParams<{ telaId?: string }>();
  const [carregando, setCarregando] = useState(true);
  const [telaAtual, setTelaAtual] = useState<Tela | null>(null);
  const [ticketsChamados, setTicketsChamados] = useState<Ticket[]>([]);
  const [ultimoTicket, setUltimoTicket] = useState<Ticket | null>(null);
  const [publicidades, setPublicidades] = useState<Publicidade[]>([]);
  const [publicidadeAtual, setPublicidadeAtual] = useState<number>(0);
  const [dataHora, setDataHora] = useState(new Date());
  const [somAtivado, setSomAtivado] = useState(true);
  const [novoTicketAnimacao, setNovoTicketAnimacao] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Verificar se está em fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Atualizar data e hora
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDataHora(new Date());
    }, 1000);
    
    return () => clearInterval(intervalo);
  }, []);

  // Rotacionar publicidades
  useEffect(() => {
    if (publicidades.length > 0) {
      const intervalo = setInterval(() => {
        setPublicidadeAtual((prev) => (prev + 1) % publicidades.length);
      }, 10000); // Trocar a cada 10 segundos
      
      return () => clearInterval(intervalo);
    }
  }, [publicidades]);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      
      try {
        // Em produção, carregar dados da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Configurar tela atual (em produção, isso viria da API)
        const tela: Tela = {
          id: 1,
          nome: 'tela 04',
          local_id: 1,
          local: {
            id: 1,
            nome: 'Unidade Central',
            status: 'ativo',
            criado_em: new Date().toISOString()
          },
          tipo_exibicao: 'ambos',
          status: 'ativo',
          criado_em: new Date().toISOString()
        };
        
        setTelaAtual(tela);
        
        // Carregar publicidades
        const publicidadesMock: Publicidade[] = [
          {
            id: 1,
            titulo: 'Paisagem Relaxante',
            tipo_midia: 'imagem',
            media_path: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
            duracao: 15,
            tela_id: 1,
            status: 'ativo',
            data_criacao: new Date().toISOString()
          },
          {
            id: 2,
            titulo: 'Natureza Exuberante',
            tipo_midia: 'imagem',
            media_path: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
            duracao: 15,
            tela_id: 1,
            status: 'ativo',
            data_criacao: new Date().toISOString()
          },
          {
            id: 3,
            titulo: 'Vista Panorâmica',
            tipo_midia: 'imagem',
            media_path: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
            duracao: 15,
            tela_id: 1,
            status: 'ativo',
            data_criacao: new Date().toISOString()
          }
        ];
        
        setPublicidades(publicidadesMock);
        
        // Carregar tickets chamados (em produção, isso viria da API)
        const tickets: Ticket[] = [
          {
            id: 101,
            numero: 11,
            fila_id: 1,
            fila: {
              id: 1,
              nome: 'Normal',
              tipo_ticket_id: 1,
              prefixo: 'N',
              tamanho_ticket: 3,
              local_id: 1,
              reset_ticket: 'diario',
              status: 'ativo',
              criado_em: new Date().toISOString()
            },
            status: 'em_atendimento',
            guiche_id: 2,
            guiche: {
              id: 2,
              nome: 'GUICHE 02',
              local_id: 1,
              status_uso: 'em_uso',
              status_ativo: 'ativo',
              criado_em: new Date().toISOString()
            },
            chamado_em: new Date().toISOString(),
            criado_em: new Date(Date.now() - 30 * 60000).toISOString(),
            ticket_completo: 'N011'
          },
          {
            id: 102,
            numero: 10,
            fila_id: 1,
            fila: {
              id: 1,
              nome: 'Normal',
              tipo_ticket_id: 1,
              prefixo: 'N',
              tamanho_ticket: 3,
              local_id: 1,
              reset_ticket: 'diario',
              status: 'ativo',
              criado_em: new Date().toISOString()
            },
            status: 'atendido',
            guiche_id: 2,
            guiche: {
              id: 2,
              nome: 'GUICHE 02',
              local_id: 1,
              status_uso: 'disponivel',
              status_ativo: 'ativo',
              criado_em: new Date().toISOString()
            },
            chamado_em: new Date(Date.now() - 5 * 60000).toISOString(),
            criado_em: new Date(Date.now() - 45 * 60000).toISOString(),
            ticket_completo: 'N010'
          },
          {
            id: 103,
            numero: 9,
            fila_id: 1,
            fila: {
              id: 1,
              nome: 'Normal',
              tipo_ticket_id: 1,
              prefixo: 'N',
              tamanho_ticket: 3,
              local_id: 1,
              reset_ticket: 'diario',
              status: 'ativo',
              criado_em: new Date().toISOString()
            },
            status: 'atendido',
            guiche_id: 2,
            guiche: {
              id: 2,
              nome: 'GUICHE 02',
              local_id: 1,
              status_uso: 'disponivel',
              status_ativo: 'ativo',
              criado_em: new Date().toISOString()
            },
            chamado_em: new Date(Date.now() - 8 * 60000).toISOString(),
            criado_em: new Date(Date.now() - 50 * 60000).toISOString(),
            ticket_completo: 'N009'
          },
          {
            id: 104,
            numero: 7,
            fila_id: 1,
            fila: {
              id: 1,
              nome: 'Normal',
              tipo_ticket_id: 1,
              prefixo: 'N',
              tamanho_ticket: 3,
              local_id: 1,
              reset_ticket: 'diario',
              status: 'ativo',
              criado_em: new Date().toISOString()
            },
            status: 'atendido',
            guiche_id: 2,
            guiche: {
              id: 2,
              nome: 'GUICHE 02',
              local_id: 1,
              status_uso: 'disponivel',
              status_ativo: 'ativo',
              criado_em: new Date().toISOString()
            },
            chamado_em: new Date(Date.now() - 12 * 60000).toISOString(),
            criado_em: new Date(Date.now() - 60 * 60000).toISOString(),
            ticket_completo: 'N007'
          },
          {
            id: 105,
            numero: 8,
            fila_id: 1,
            fila: {
              id: 1,
              nome: 'Normal',
              tipo_ticket_id: 1,
              prefixo: 'N',
              tamanho_ticket: 3,
              local_id: 1,
              reset_ticket: 'diario',
              status: 'ativo',
              criado_em: new Date().toISOString()
            },
            status: 'atendido',
            guiche_id: 2,
            guiche: {
              id: 2,
              nome: 'GUICHE 02',
              local_id: 1,
              status_uso: 'disponivel',
              status_ativo: 'ativo',
              criado_em: new Date().toISOString()
            },
            chamado_em: new Date(Date.now() - 15 * 60000).toISOString(),
            criado_em: new Date(Date.now() - 65 * 60000).toISOString(),
            ticket_completo: 'N008'
          }
        ];
        
        setTicketsChamados(tickets);
        
        // Configurar último ticket chamado
        setUltimoTicket(tickets[0]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [telaId]);

  // Simular chamada de novo ticket a cada 20 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
      
      const novoTicket: Ticket = {
        id: Date.now(),
        numero: numeroAleatorio,
        fila_id: 1,
        fila: {
          id: 1,
          nome: 'Normal',
          tipo_ticket_id: 1,
          prefixo: 'N',
          tamanho_ticket: 3,
          local_id: 1,
          reset_ticket: 'diario',
          status: 'ativo',
          criado_em: new Date().toISOString()
        },
        status: 'em_atendimento',
        guiche_id: 2,
        guiche: {
          id: 2,
          nome: 'GUICHE 02',
          local_id: 1,
          status_uso: 'em_uso',
          status_ativo: 'ativo',
          criado_em: new Date().toISOString()
        },
        chamado_em: new Date().toISOString(),
        criado_em: new Date(Date.now() - Math.floor(Math.random() * 60) * 60000).toISOString(),
        ticket_completo: `N${numeroAleatorio.toString().padStart(3, '0')}`
      };
      
      // Atualizar último ticket
      setUltimoTicket(novoTicket);
      
      // Adicionar à lista de tickets chamados
      setTicketsChamados(prev => [novoTicket, ...prev.slice(0, 9)]);
      
      // Ativar animação
      setNovoTicketAnimacao(true);
      setTimeout(() => setNovoTicketAnimacao(false), 3000);
      
      // Reproduzir som
      if (somAtivado) {
        // Em produção, reproduzir som de chamada
        console.log('🔊 Chamando ticket:', novoTicket.ticket_completo);
      }
    }, 20000);
    
    return () => clearInterval(intervalo);
  }, [somAtivado]);

  // Alternar som
  const alternarSom = () => {
    setSomAtivado(!somAtivado);
  };

  // Alternar fullscreen
  const alternarFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao alternar fullscreen:', error);
    }
  };

  // Renderizar conteúdo da publicidade
  const renderizarPublicidade = (publicidade: Publicidade) => {
    switch (publicidade.tipo_midia) {
      case 'imagem':
        return (
          <img
            src={publicidade.media_path}
            alt={publicidade.titulo}
            className="w-full h-full object-cover"
          />
        );
      case 'video':
        return (
          <video
            src={publicidade.media_path}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{publicidade.titulo}</h2>
            </div>
          </div>
        );
    }
  };

  // Carregando
  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-800">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se a tela não existir
  if (!telaAtual) {
    return (
      <div className="min-h-screen bg-blue-800 flex items-center justify-center">
        <div className="text-center text-white">
          <Users className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">Tela não encontrada</h3>
          <p className="text-blue-200">
            A tela solicitada não está disponível ou não existe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Cabeçalho */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-800" />
          </div>
          <span className="text-lg font-semibold">{telaAtual.nome}</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-lg font-bold">
              {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 rounded-full text-white hover:bg-blue-700 focus:outline-none transition-colors"
              onClick={alternarSom}
            >
              {somAtivado ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>
            
            <button
              type="button"
              className="p-2 rounded-full text-white hover:bg-blue-700 focus:outline-none transition-colors"
              onClick={alternarFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex h-screen pt-16">
        {/* Seção de Senhas - 45% */}
        <div className="w-[45%] bg-white flex flex-col">
          {/* Ticket principal */}
          <div className={`bg-blue-800 text-white p-8 transition-all duration-500 ${novoTicketAnimacao ? 'animate-pulse bg-blue-600' : ''}`}>
            {ultimoTicket ? (
              <div>
                {/* Número do ticket */}
                <div className="text-center mb-6">
                  <div className="text-8xl font-bold text-yellow-300 mb-2">
                    {ultimoTicket.ticket_completo}
                  </div>
                  <div className="text-2xl font-medium">
                    LOCAL {'>'} {ultimoTicket.guiche?.nome}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-16 w-16 text-blue-300" />
                <p className="mt-4 text-xl font-medium">
                  Aguardando chamadas
                </p>
              </div>
            )}
          </div>
          
          {/* Lista de últimas senhas */}
          <div className="flex-1 bg-gray-50">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Últimas Senhas Chamadas
                </h3>
              </div>
              
              {ticketsChamados.length > 0 ? (
                <div className="space-y-1">
                  {/* Cabeçalho da tabela */}
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 pb-2 border-b border-gray-300">
                    <div>Senha</div>
                    <div>Local</div>
                    <div>Status</div>
                    <div>Hora</div>
                  </div>
                  
                  {/* Linhas da tabela */}
                  {ticketsChamados.slice(0, 12).map((ticket, index) => (
                    <div 
                      key={ticket.id}
                      className={`grid grid-cols-4 gap-4 py-2 text-sm border-b border-gray-200 ${
                        index === 0 ? 'bg-blue-50 font-medium' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{ticket.ticket_completo}</div>
                      <div className="text-gray-700">{ticket.guiche?.nome}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'em_atendimento' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status === 'em_atendimento' ? 'Atendida' : 'Atendida'}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {new Date(ticket.chamado_em || '').toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma senha chamada</h3>
                  <p className="mt-2 text-gray-500">
                    As senhas chamadas aparecerão aqui.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Seção de Publicidades - 55% */}
        <div className="w-[55%] relative">
          {publicidades.length > 0 ? (
            <div className="h-full relative">
              {/* Publicidade atual */}
              <div className="h-full">
                {renderizarPublicidade(publicidades[publicidadeAtual])}
              </div>
              
              {/* Indicadores de publicidade */}
              {publicidades.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {publicidades.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === publicidadeAtual 
                          ? 'bg-white shadow-lg scale-125' 
                          : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="mx-auto h-20 w-20 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Área de Publicidade</h3>
                <p className="text-xl text-blue-200">
                  Conteúdo publicitário será exibido aqui
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PainelChamada;