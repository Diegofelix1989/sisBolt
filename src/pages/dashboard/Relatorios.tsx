import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter, FileText, TrendingUp, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { formatarDataHora } from '../../utils/formatadores';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

interface FiltrosRelatorio {
  data_inicio: string;
  data_fim: string;
  local_id?: string;
  fila_id?: string;
  tipo_relatorio: string;
}

interface EstatisticasRelatorio {
  total_tickets: number;
  tickets_atendidos: number;
  tickets_cancelados: number;
  tickets_aguardando: number;
  tempo_medio_espera: number;
  tempo_medio_atendimento: number;
  pico_atendimento: string;
}

function Relatorios() {
  const [carregando, setCarregando] = useState(false);
  const [estatisticas, setEstatisticas] = useState<EstatisticasRelatorio | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<any>(null);
  const [locais] = useState([
    { id: 1, nome: 'Unidade Central' },
    { id: 2, nome: 'Filial Norte' }
  ]);
  const [filas] = useState([
    { id: 1, nome: 'Prioritário' },
    { id: 2, nome: 'Comum' },
    { id: 3, nome: 'Empresarial' }
  ]);

  const { register, handleSubmit, formState: { errors } } = useForm<FiltrosRelatorio>();

  // Gerar relatório
  const gerarRelatorio = async (filtros: FiltrosRelatorio) => {
    setCarregando(true);
    
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dados simulados
      const estatisticasMock: EstatisticasRelatorio = {
        total_tickets: 245,
        tickets_atendidos: 198,
        tickets_cancelados: 12,
        tickets_aguardando: 35,
        tempo_medio_espera: 18,
        tempo_medio_atendimento: 12,
        pico_atendimento: '14:30'
      };
      
      setEstatisticas(estatisticasMock);
      
      // Dados para gráficos
      if (filtros.tipo_relatorio === 'atendimentos_por_dia') {
        setDadosGrafico({
          type: 'bar',
          data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [
              {
                label: 'Atendidos',
                data: [45, 52, 38, 41, 48, 25, 12],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1
              },
              {
                label: 'Cancelados',
                data: [3, 5, 2, 4, 3, 2, 1],
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1
              }
            ]
          }
        });
      } else if (filtros.tipo_relatorio === 'distribuicao_filas') {
        setDadosGrafico({
          type: 'doughnut',
          data: {
            labels: ['Prioritário', 'Comum', 'Empresarial'],
            datasets: [
              {
                data: [85, 120, 40],
                backgroundColor: [
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(168, 85, 247, 0.8)'
                ],
                borderColor: [
                  'rgba(239, 68, 68, 1)',
                  'rgba(59, 130, 246, 1)',
                  'rgba(168, 85, 247, 1)'
                ],
                borderWidth: 2
              }
            ]
          }
        });
      } else if (filtros.tipo_relatorio === 'tempo_espera') {
        setDadosGrafico({
          type: 'line',
          data: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
            datasets: [
              {
                label: 'Tempo Médio de Espera (min)',
                data: [8, 15, 25, 18, 12, 6],
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          }
        });
      }
      
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Exportar relatório
  const exportarRelatorio = (formato: 'pdf' | 'excel') => {
    toast.success(`Relatório exportado em ${formato.toUpperCase()}!`);
    // Em produção, implementar exportação real
  };

  // Configurações dos gráficos
  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: dadosGrafico?.type !== 'doughnut' ? {
      y: {
        beginAtZero: true
      }
    } : undefined
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gere relatórios detalhados sobre o desempenho do sistema
          </p>
        </div>
      </div>

      {/* Formulário de filtros */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
          <h3 className="text-lg leading-6 font-medium text-blue-900 flex items-center">
            <Filter className="mr-2 h-6 w-6" />
            Filtros do Relatório
          </h3>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit(gerarRelatorio)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
                  Data Início
                </label>
                <input
                  type="date"
                  {...register('data_inicio', { required: 'Data início é obrigatória' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.data_inicio && (
                  <p className="mt-1 text-sm text-red-600">{errors.data_inicio.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">
                  Data Fim
                </label>
                <input
                  type="date"
                  {...register('data_fim', { required: 'Data fim é obrigatória' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.data_fim && (
                  <p className="mt-1 text-sm text-red-600">{errors.data_fim.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="local_id" className="block text-sm font-medium text-gray-700">
                  Local (Opcional)
                </label>
                <select
                  {...register('local_id')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Todos os locais</option>
                  {locais.map(local => (
                    <option key={local.id} value={local.id}>
                      {local.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fila_id" className="block text-sm font-medium text-gray-700">
                  Fila (Opcional)
                </label>
                <select
                  {...register('fila_id')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Todas as filas</option>
                  {filas.map(fila => (
                    <option key={fila.id} value={fila.id}>
                      {fila.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tipo_relatorio" className="block text-sm font-medium text-gray-700">
                Tipo de Relatório
              </label>
              <select
                {...register('tipo_relatorio', { required: 'Tipo de relatório é obrigatório' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione o tipo</option>
                <option value="atendimentos_por_dia">Atendimentos por Dia</option>
                <option value="distribuicao_filas">Distribuição por Filas</option>
                <option value="tempo_espera">Tempo de Espera</option>
                <option value="desempenho_atendentes">Desempenho dos Atendentes</option>
                <option value="picos_movimento">Picos de Movimento</option>
              </select>
              {errors.tipo_relatorio && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_relatorio.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={carregando}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Tickets</dt>
                    <dd className="text-lg font-medium text-gray-900">{estatisticas.total_tickets}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Atendidos</dt>
                    <dd className="text-lg font-medium text-gray-900">{estatisticas.tickets_atendidos}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tempo Médio Espera</dt>
                    <dd className="text-lg font-medium text-gray-900">{estatisticas.tempo_medio_espera} min</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pico de Atendimento</dt>
                    <dd className="text-lg font-medium text-gray-900">{estatisticas.pico_atendimento}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico */}
      {dadosGrafico && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-blue-900">
              Visualização dos Dados
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => exportarRelatorio('pdf')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => exportarRelatorio('excel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-96">
              {dadosGrafico.type === 'bar' && (
                <Bar data={dadosGrafico.data} options={opcoesGrafico} />
              )}
              {dadosGrafico.type === 'doughnut' && (
                <Doughnut data={dadosGrafico.data} options={opcoesGrafico} />
              )}
              {dadosGrafico.type === 'line' && (
                <Line data={dadosGrafico.data} options={opcoesGrafico} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de dados detalhados */}
      {estatisticas && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg leading-6 font-medium text-blue-900">
              Resumo Detalhado
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Estatísticas Gerais</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Total de Tickets:</dt>
                    <dd className="text-sm font-medium text-gray-900">{estatisticas.total_tickets}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tickets Atendidos:</dt>
                    <dd className="text-sm font-medium text-green-600">{estatisticas.tickets_atendidos}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tickets Cancelados:</dt>
                    <dd className="text-sm font-medium text-red-600">{estatisticas.tickets_cancelados}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tickets Aguardando:</dt>
                    <dd className="text-sm font-medium text-yellow-600">{estatisticas.tickets_aguardando}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Tempos de Atendimento</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tempo Médio de Espera:</dt>
                    <dd className="text-sm font-medium text-gray-900">{estatisticas.tempo_medio_espera} minutos</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tempo Médio de Atendimento:</dt>
                    <dd className="text-sm font-medium text-gray-900">{estatisticas.tempo_medio_atendimento} minutos</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Horário de Pico:</dt>
                    <dd className="text-sm font-medium text-gray-900">{estatisticas.pico_atendimento}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Taxa de Atendimento:</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {Math.round((estatisticas.tickets_atendidos / estatisticas.total_tickets) * 100)}%
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Relatorios;