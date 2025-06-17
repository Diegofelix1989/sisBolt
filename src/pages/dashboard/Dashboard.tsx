import React from 'react';
import { Users, CheckSquare, Clock, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard: React.FC = () => {
  // Dados para o gráfico de rosca
  const statusData = {
    labels: ['Atendidos', 'Aguardando', 'Em Atendimento', 'Cancelados'],
    datasets: [
      {
        data: [65, 15, 10, 10],
        backgroundColor: [
          '#10B981', // verde
          '#3B82F6', // azul
          '#F59E0B', // laranja
          '#EF4444', // vermelho
        ],
        borderColor: [
          '#fff',
          '#fff',
          '#fff',
          '#fff',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Dados para o gráfico de linha
  const atendimentosData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Atendimentos',
        data: [32, 45, 38, 41, 52, 25, 10],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Tempo Médio (min)',
        data: [12, 15, 18, 14, 11, 10, 8],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Dados de cards
  const cards = [
    { 
      title: 'Total de Atendimentos', 
      value: '432', 
      icon: Users, 
      color: 'bg-blue-500', 
      change: '+8% em relação à semana passada' 
    },
    { 
      title: 'Atendimentos Concluídos', 
      value: '321', 
      icon: CheckSquare, 
      color: 'bg-green-500',
      change: '+12% em relação à semana passada'  
    },
    { 
      title: 'Tempo Médio de Espera', 
      value: '14 min', 
      icon: Clock, 
      color: 'bg-yellow-500',
      change: '-5% em relação à semana passada'  
    },
    { 
      title: 'Tickets Cancelados', 
      value: '21', 
      icon: AlertTriangle, 
      color: 'bg-red-500',
      change: '+2% em relação à semana passada'  
    },
  ];

  // Tabela de últimos atendimentos
  const ultimosAtendimentos = [
    { id: 1, numero: 'P001', fila: 'Prioritário', status: 'Atendido', tempo: '12 min', atendente: 'João Silva' },
    { id: 2, numero: 'C023', fila: 'Comum', status: 'Atendido', tempo: '15 min', atendente: 'Maria Oliveira' },
    { id: 3, numero: 'P002', fila: 'Prioritário', status: 'Cancelado', tempo: '8 min', atendente: 'Pedro Santos' },
    { id: 4, numero: 'C024', fila: 'Comum', status: 'Atendido', tempo: '23 min', atendente: 'Ana Costa' },
    { id: 5, numero: 'C025', fila: 'Comum', status: 'Atendido', tempo: '18 min', atendente: 'João Silva' },
  ];

  // Próximos dias
  const proximosDias = [
    { id: 1, data: '15/06/2025', dia: 'Segunda', previsao: '45 atendimentos' },
    { id: 2, data: '16/06/2025', dia: 'Terça', previsao: '52 atendimentos' },
    { id: 3, data: '17/06/2025', dia: 'Quarta', previsao: '48 atendimentos' },
  ];

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Atendimentos da Semana</h3>
          <div className="h-64">
            <Line 
              data={atendimentosData} 
              options={{
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
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Status dos Tickets</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={statusData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Últimos Atendimentos</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalhes dos atendimentos mais recentes.</p>
            </div>
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <div className="border-t border-gray-200">
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
                    Tempo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atendente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ultimosAtendimentos.map((atendimento) => (
                  <tr key={atendimento.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {atendimento.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {atendimento.fila}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        atendimento.status === 'Atendido' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {atendimento.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {atendimento.tempo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {atendimento.atendente}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Próximos Dias</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Previsão de atendimentos.</p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {proximosDias.map((dia) => (
                <li key={dia.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm font-medium text-gray-900">{dia.data}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {dia.previsao}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {dia.dia}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;