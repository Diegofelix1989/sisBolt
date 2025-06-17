import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Contextos
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import PublicoLayout from './layouts/PublicoLayout';

// Páginas de autenticação
import Login from './pages/auth/Login';

// Páginas do dashboard
import Dashboard from './pages/dashboard/Dashboard';
import Empresas from './pages/dashboard/Empresas';
import Usuarios from './pages/dashboard/Usuarios';
import Locais from './pages/dashboard/Locais';
import TiposTicket from './pages/dashboard/TiposTicket';
import Filas from './pages/dashboard/Filas';
import Guiches from './pages/dashboard/Guiches';
import Telas from './pages/dashboard/Telas';
import Publicidades from './pages/dashboard/Publicidades';
import Impressoras from './pages/dashboard/Impressoras';
import Relatorios from './pages/dashboard/Relatorios';
import Configuracoes from './pages/dashboard/Configuracoes';

// Páginas de atendimento
import Atendimento from './pages/atendimento/Atendimento';

// Páginas públicas
import EmissaoTicket from './pages/publico/EmissaoTicket';
import PainelChamada from './pages/publico/PainelChamada';

// Páginas de erro
import NaoEncontrado from './pages/erros/NaoEncontrado';

// Configuração do cliente de consulta
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rotas de autenticação */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Rotas do dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="empresas" element={<Empresas />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="locais" element={<Locais />} />
              <Route path="tipos-ticket" element={<TiposTicket />} />
              <Route path="filas" element={<Filas />} />
              <Route path="guiches" element={<Guiches />} />
              <Route path="telas" element={<Telas />} />
              <Route path="publicidades" element={<Publicidades />} />
              <Route path="impressoras" element={<Impressoras />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>

            {/* Rotas de atendimento */}
            <Route path="/atendimento" element={<DashboardLayout />}>
              <Route index element={<Atendimento />} />
            </Route>

            {/* Rotas públicas */}
            <Route element={<PublicoLayout />}>
              <Route path="/emitir-ticket/:localId?" element={<EmissaoTicket />} />
              <Route path="/painel/:telaId?" element={<PainelChamada />} />
              <Route path="/" element={<EmissaoTicket />} />
            </Route>

            {/* Rota para página não encontrada */}
            <Route path="*" element={<NaoEncontrado />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;