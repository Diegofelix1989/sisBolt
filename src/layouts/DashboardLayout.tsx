import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, Users, MapPin, Tag, List, Monitor,
  Image, Printer, BarChart2, Settings, LogOut, Menu, X,
  BellRing, Search, User, MessageSquare, Building2
} from 'lucide-react';
import { TipoUsuario } from '../types';
import { classNames } from '../utils/classNames';

const DashboardLayout: React.FC = () => {
  const { usuario, logout, isMasterAdmin, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!usuario) {
    navigate('/login');
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, masterAdmin: true, admin: true, atendente: true },
    { name: 'Empresas', href: '/dashboard/empresas', icon: Building2, masterAdmin: true, admin: false, atendente: false },
    { name: 'Usuários', href: '/dashboard/usuarios', icon: Users, masterAdmin: true, admin: true, atendente: false },
    { name: 'Locais', href: '/dashboard/locais', icon: MapPin, masterAdmin: true, admin: true, atendente: false },
    { name: 'Tipos de Ticket', href: '/dashboard/tipos-ticket', icon: Tag, masterAdmin: true, admin: true, atendente: false },
    { name: 'Filas', href: '/dashboard/filas', icon: List, masterAdmin: true, admin: true, atendente: false },
    { name: 'Guichês', href: '/dashboard/guiches', icon: MessageSquare, masterAdmin: true, admin: true, atendente: false },
    { name: 'Telas', href: '/dashboard/telas', icon: Monitor, masterAdmin: true, admin: true, atendente: false },
    { name: 'Publicidades', href: '/dashboard/publicidades', icon: Image, masterAdmin: true, admin: true, atendente: false },
    { name: 'Impressoras', href: '/dashboard/impressoras', icon: Printer, masterAdmin: true, admin: true, atendente: false },
    { name: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart2, masterAdmin: true, admin: true, atendente: true },
    { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings, masterAdmin: true, admin: true, atendente: false },
    { name: 'Atendimento', href: '/atendimento', icon: MessageSquare, masterAdmin: true, admin: true, atendente: true },
  ];

  // Filtrar navegação com base no tipo de usuário
  const filteredNavigation = navigation.filter(item => {
    if (isMasterAdmin()) return item.masterAdmin;
    if (isAdmin()) return item.admin;
    return item.atendente;
  });

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getTipoUsuarioLabel = (tipo: TipoUsuario) => {
    switch (tipo) {
      case TipoUsuario.MASTER_ADMIN:
        return 'Master Admin';
      case TipoUsuario.ADMIN:
        return 'Administrador';
      case TipoUsuario.ATENDENTE:
        return 'Atendente';
      default:
        return 'Usuário';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para mobile */}
      <div 
        className={classNames(
          "fixed inset-0 z-40 flex md:hidden",
          sidebarOpen ? "visible" : "invisible"
        )}
        aria-hidden="true"
      >
        <div 
          className={classNames(
            "fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
          onClick={closeSidebar}
        />

        <div 
          className={classNames(
            "relative flex-1 flex flex-col max-w-xs w-full bg-blue-800 transform transition ease-in-out duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeSidebar}
            >
              <span className="sr-only">Fechar menu</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-white">Gerenciador de Filas</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-100 hover:bg-blue-700',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                  )}
                  onClick={closeSidebar}
                >
                  <item.icon 
                    className={classNames(
                      location.pathname === item.href 
                        ? 'text-blue-100' 
                        : 'text-blue-300 group-hover:text-blue-100',
                      'mr-4 flex-shrink-0 h-6 w-6'
                    )} 
                    aria-hidden="true" 
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
            <div className="flex items-center">
              <div>
                <User className="inline-block h-9 w-9 rounded-full text-blue-100" />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">
                  {usuario?.nome}
                </p>
                <p className="text-sm font-medium text-blue-200 group-hover:text-blue-100">
                  {getTipoUsuarioLabel(usuario?.tipo)}
                </p>
                {usuario?.empresa && (
                  <p className="text-xs text-blue-300">
                    {usuario.empresa.nome}
                  </p>
                )}
              </div>
            </div>
            <button
              className="ml-auto flex-shrink-0 bg-blue-700 p-1 text-blue-200 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={logout}
            >
              <span className="sr-only">Sair</span>
              <LogOut className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 w-14" aria-hidden="true">
        </div>
      </div>

      {/* Sidebar estática para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-white">Gerenciador de Filas</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-100 hover:bg-blue-700',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon 
                    className={classNames(
                      location.pathname === item.href 
                        ? 'text-blue-100' 
                        : 'text-blue-300 group-hover:text-blue-100',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )} 
                    aria-hidden="true" 
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
            <div className="flex items-center">
              <div>
                <User className="inline-block h-9 w-9 rounded-full text-blue-100" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {usuario?.nome}
                </p>
                <p className="text-xs font-medium text-blue-200">
                  {getTipoUsuarioLabel(usuario?.tipo)}
                </p>
                {usuario?.empresa && (
                  <p className="text-xs text-blue-300">
                    {usuario.empresa.nome}
                  </p>
                )}
              </div>
            </div>
            <button
              className="ml-auto flex-shrink-0 bg-blue-700 p-1 text-blue-200 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={logout}
            >
              <span className="sr-only">Sair</span>
              <LogOut className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Cabeçalho */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {filteredNavigation.find(item => item.href === location.pathname)?.name || 
                 (location.pathname === '/atendimento' ? 'Atendimento' : 'Dashboard')}
              </h1>
              {usuario?.empresa && !isMasterAdmin() && (
                <p className="text-sm text-gray-500 mt-1">
                  {usuario.empresa.nome}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Buscar"
                />
              </div>
              <button
                type="button"
                className="flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Notificações</span>
                <BellRing className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;