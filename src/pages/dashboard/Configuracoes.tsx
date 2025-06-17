import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Bell, Volume2, Clock, Monitor, Printer, Database } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface ConfiguracoesSistema {
  // Configurações gerais
  nome_sistema: string;
  tempo_chamada_ticket: number;
  tempo_exibicao_publicidade: number;
  som_chamada_ativo: boolean;
  volume_som: number;
  
  // Configurações de tickets
  reset_numeracao_automatico: boolean;
  horario_reset: string;
  prefixo_padrao: string;
  tamanho_numero_padrao: number;
  
  // Configurações de tela
  cor_tema_principal: string;
  cor_tema_secundaria: string;
  fonte_tamanho: number;
  exibir_data_hora: boolean;
  
  // Configurações de impressão
  impressao_automatica: boolean;
  impressora_padrao_id?: number;
  cabecalho_ticket: string;
  rodape_ticket: string;
  
  // Configurações de backup
  backup_automatico: boolean;
  frequencia_backup: string;
  manter_backups_dias: number;
}

function Configuracoes() {
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState('geral');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConfiguracoesSistema>();
  
  // Carregar configurações
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Configurações padrão
        const configPadrao: ConfiguracoesSistema = {
          nome_sistema: 'Sistema de Gerenciamento de Filas',
          tempo_chamada_ticket: 30,
          tempo_exibicao_publicidade: 10,
          som_chamada_ativo: true,
          volume_som: 80,
          reset_numeracao_automatico: true,
          horario_reset: '00:00',
          prefixo_padrao: 'A',
          tamanho_numero_padrao: 3,
          cor_tema_principal: '#1e40af',
          cor_tema_secundaria: '#3b82f6',
          fonte_tamanho: 16,
          exibir_data_hora: true,
          impressao_automatica: true,
          cabecalho_ticket: 'SISTEMA DE FILAS\nUnidade de Atendimento',
          rodape_ticket: 'Aguarde sua chamada\nObrigado pela preferência!',
          backup_automatico: true,
          frequencia_backup: 'diario',
          manter_backups_dias: 30
        };
        
        reset(configPadrao);
      } catch (error) {
        toast.error('Erro ao carregar configurações');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarConfiguracoes();
  }, [reset]);

  // Salvar configurações
  const salvarConfiguracoes = async (dados: ConfiguracoesSistema) => {
    setSalvando(true);
    
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error(error);
    } finally {
      setSalvando(false);
    }
  };

  // Resetar configurações
  const resetarConfiguracoes = async () => {
    if (!confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) return;
    
    try {
      setCarregando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Recarregar configurações padrão
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao resetar configurações');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const abas = [
    { id: 'geral', nome: 'Geral', icone: Settings },
    { id: 'tickets', nome: 'Tickets', icone: RefreshCw },
    { id: 'interface', nome: 'Interface', icone: Monitor },
    { id: 'impressao', nome: 'Impressão', icone: Printer },
    { id: 'backup', nome: 'Backup', icone: Database }
  ];

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configurações do Sistema</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure o comportamento e aparência do sistema
          </p>
        </div>
        <button
          type="button"
          onClick={resetarConfiguracoes}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Resetar Padrões
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Abas */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id)}
                className={`${
                  abaSelecionada === aba.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <aba.icone className="h-5 w-5 mr-2" />
                {aba.nome}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <form onSubmit={handleSubmit(salvarConfiguracoes)} className="p-6">
          {/* Aba Geral */}
          {abaSelecionada === 'geral' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações Gerais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nome_sistema" className="block text-sm font-medium text-gray-700">
                      Nome do Sistema
                    </label>
                    <input
                      type="text"
                      {...register('nome_sistema', { required: 'Nome é obrigatório' })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.nome_sistema && (
                      <p className="mt-1 text-sm text-red-600">{errors.nome_sistema.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tempo_chamada_ticket" className="block text-sm font-medium text-gray-700">
                      Tempo de Chamada (segundos)
                    </label>
                    <input
                      type="number"
                      {...register('tempo_chamada_ticket', { 
                        required: 'Tempo é obrigatório',
                        min: { value: 10, message: 'Mínimo 10 segundos' },
                        max: { value: 120, message: 'Máximo 120 segundos' }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.tempo_chamada_ticket && (
                      <p className="mt-1 text-sm text-red-600">{errors.tempo_chamada_ticket.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tempo_exibicao_publicidade" className="block text-sm font-medium text-gray-700">
                      Tempo de Publicidade (segundos)
                    </label>
                    <input
                      type="number"
                      {...register('tempo_exibicao_publicidade', { 
                        required: 'Tempo é obrigatório',
                        min: { value: 5, message: 'Mínimo 5 segundos' },
                        max: { value: 60, message: 'Máximo 60 segundos' }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.tempo_exibicao_publicidade && (
                      <p className="mt-1 text-sm text-red-600">{errors.tempo_exibicao_publicidade.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="volume_som" className="block text-sm font-medium text-gray-700">
                      Volume do Som (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      {...register('volume_som')}
                      className="mt-1 block w-full"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('som_chamada_ativo')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Ativar som de chamada
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Tickets */}
          {abaSelecionada === 'tickets' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Tickets</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="prefixo_padrao" className="block text-sm font-medium text-gray-700">
                      Prefixo Padrão
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      {...register('prefixo_padrao', { required: 'Prefixo é obrigatório' })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.prefixo_padrao && (
                      <p className="mt-1 text-sm text-red-600">{errors.prefixo_padrao.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tamanho_numero_padrao" className="block text-sm font-medium text-gray-700">
                      Tamanho do Número
                    </label>
                    <select
                      {...register('tamanho_numero_padrao')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value={2}>2 dígitos (01, 02, ...)</option>
                      <option value={3}>3 dígitos (001, 002, ...)</option>
                      <option value={4}>4 dígitos (0001, 0002, ...)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="horario_reset" className="block text-sm font-medium text-gray-700">
                      Horário de Reset
                    </label>
                    <input
                      type="time"
                      {...register('horario_reset')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('reset_numeracao_automatico')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Reset automático da numeração
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Interface */}
          {abaSelecionada === 'interface' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Interface</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cor_tema_principal" className="block text-sm font-medium text-gray-700">
                      Cor Principal
                    </label>
                    <input
                      type="color"
                      {...register('cor_tema_principal')}
                      className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="cor_tema_secundaria" className="block text-sm font-medium text-gray-700">
                      Cor Secundária
                    </label>
                    <input
                      type="color"
                      {...register('cor_tema_secundaria')}
                      className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="fonte_tamanho" className="block text-sm font-medium text-gray-700">
                      Tamanho da Fonte (px)
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      {...register('fonte_tamanho')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('exibir_data_hora')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Exibir data e hora nas telas
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Impressão */}
          {abaSelecionada === 'impressao' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Impressão</h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="cabecalho_ticket" className="block text-sm font-medium text-gray-700">
                      Cabeçalho do Ticket
                    </label>
                    <textarea
                      {...register('cabecalho_ticket')}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="rodape_ticket" className="block text-sm font-medium text-gray-700">
                      Rodapé do Ticket
                    </label>
                    <textarea
                      {...register('rodape_ticket')}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('impressao_automatica')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Impressão automática de tickets
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Backup */}
          {abaSelecionada === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Backup</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="frequencia_backup" className="block text-sm font-medium text-gray-700">
                      Frequência do Backup
                    </label>
                    <select
                      {...register('frequencia_backup')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="manter_backups_dias" className="block text-sm font-medium text-gray-700">
                      Manter Backups (dias)
                    </label>
                    <input
                      type="number"
                      min="7"
                      max="365"
                      {...register('manter_backups_dias')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('backup_automatico')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Backup automático
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Configuracoes;