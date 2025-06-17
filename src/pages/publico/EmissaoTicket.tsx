import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Users, Printer, AlertTriangle, Clock, Ticket, CheckCircle
} from 'lucide-react';
import { Fila, Local, TicketParaEmissao } from '../../types';
import { classNames } from '../../utils/classNames';

const EmissaoTicket: React.FC = () => {
  const { localId } = useParams<{ localId?: string }>();
  const [carregando, setCarregando] = useState(true);
  const [localAtual, setLocalAtual] = useState<Local | null>(null);
  const [filas, setFilas] = useState<Fila[]>([]);
  const [filaSelecionada, setFilaSelecionada] = useState<number | null>(null);
  const [observacao, setObservacao] = useState('');
  const [ultimoTicket, setUltimoTicket] = useState<string | null>(null);
  const [emitindoTicket, setEmitindoTicket] = useState(false);
  const [sucessoEmissao, setSucessoEmissao] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      
      try {
        // Em produção, carregar dados da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Configurar local atual (em produção, isso viria da API)
        const local: Local = {
          id: 1,
          nome: 'Unidade Central',
          descricao: 'Unidade central de atendimento',
          status: 'ativo',
          criado_em: new Date().toISOString()
        };
        
        setLocalAtual(local);
        
        // Carregar filas disponíveis (em produção, isso viria da API)
        const filasDisponiveis: Fila[] = [
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
          }
        ];
        
        setFilas(filasDisponiveis);
        
        // Pré-selecionar a fila comum por padrão
        setFilaSelecionada(2);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [localId]);

  // Emitir ticket
  const emitirTicket = async () => {
    if (!filaSelecionada) {
      alert('Selecione uma fila primeiro!');
      return;
    }
    
    setEmitindoTicket(true);
    setSucessoEmissao(false);
    
    try {
      // Em produção, emitir ticket via API
      const dadosTicket: TicketParaEmissao = {
        fila_id: filaSelecionada,
        observacao: observacao.trim() || undefined
      };
      
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular resposta da API
      const filaEmitida = filas.find(f => f.id === filaSelecionada);
      const numeroTicket = Math.floor(Math.random() * 100) + 1;
      const ticketFormatado = `${filaEmitida?.prefixo}${numeroTicket.toString().padStart(filaEmitida?.tamanho_ticket || 3, '0')}`;
      
      setUltimoTicket(ticketFormatado);
      setSucessoEmissao(true);
      
      // Limpar campos após emissão
      setObservacao('');
      
      // Em produção, imprimir ticket
      // imprimirTicket(ticketFormatado);
    } catch (error) {
      console.error('Erro ao emitir ticket:', error);
      alert('Erro ao emitir ticket. Tente novamente.');
    } finally {
      setEmitindoTicket(false);
    }
  };

  // Retornar para emissão após sucesso
  const voltarParaEmissao = () => {
    setSucessoEmissao(false);
    setUltimoTicket(null);
  };

  // Carregando
  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se o local não existir
  if (!localAtual) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="p-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Local não encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            O local solicitado não está disponível ou não existe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Cabeçalho do local */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-6 py-5 bg-blue-800 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="mr-3 h-8 w-8" />
            Emissão de Ticket
          </h2>
          <p className="mt-1 text-blue-100">
            {localAtual.nome} - {localAtual.descricao}
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      {sucessoEmissao && ultimoTicket ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 rounded-full bg-green-100">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-gray-900 mb-4">Ticket emitido com sucesso!</h3>
            
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 rounded-lg bg-blue-100 flex flex-col items-center justify-center border-2 border-blue-300">
                <span className="text-sm text-blue-800 mb-2">Seu número é</span>
                <span className="text-5xl font-bold text-blue-800">{ultimoTicket}</span>
                <span className="mt-4 text-sm text-blue-800">Aguarde sua chamada</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={voltarParaEmissao}
              >
                <Ticket className="h-5 w-5 mr-2" /> Emitir outro ticket
              </button>
              
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> 
                Tempo estimado de espera: 15-20 minutos
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Selecione o tipo de atendimento
            </h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Seleção de filas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Atendimento
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filas.map((fila) => (
                    <div 
                      key={fila.id}
                      className={classNames(
                        "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                        filaSelecionada === fila.id
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                          : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                      )}
                      onClick={() => setFilaSelecionada(fila.id)}
                    >
                      <div className="flex items-start">
                        <div className={classNames(
                          "h-5 w-5 rounded-full mr-3 mt-0.5",
                          filaSelecionada === fila.id ? "bg-blue-500" : "bg-gray-200"
                        )}></div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{fila.nome}</h4>
                          <p className="text-sm text-gray-500">
                            {fila.nome === 'Prioritário' 
                              ? 'Para idosos, gestantes, pessoas com deficiência ou com crianças de colo'
                              : 'Atendimento geral para todos os demais casos'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Observações */}
              <div>
                <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">
                  Observações (opcional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="observacao"
                    name="observacao"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Digite alguma informação adicional se necessário"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Botão de emissão */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={emitirTicket}
                  disabled={!filaSelecionada || emitindoTicket}
                >
                  {emitindoTicket ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Emitindo...
                    </>
                  ) : (
                    <>
                      <Printer className="mr-2 h-5 w-5" /> Emitir Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissaoTicket;