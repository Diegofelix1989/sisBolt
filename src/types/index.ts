/**
 * Tipos de dados para o sistema de gerenciamento de filas
 */

// Enums
export enum TipoUsuario {
  MASTER_ADMIN = 'master_admin',
  ADMIN = 'admin',
  ATENDENTE = 'atendente'
}

export enum StatusAtivo {
  ATIVO = 'ativo',
  INATIVO = 'inativo'
}

export enum StatusUsoGuiche {
  DISPONIVEL = 'disponivel',
  EM_USO = 'em_uso'
}

export enum TipoExibicao {
  TICKETS = 'tickets',
  PUBLICIDADE = 'publicidade',
  AMBOS = 'ambos'
}

export enum TipoMidia {
  IMAGEM = 'imagem',
  VIDEO = 'video',
  TEXTO = 'texto',
  URL = 'url'
}

export enum StatusTicket {
  AGUARDANDO = 'aguardando',
  EM_ATENDIMENTO = 'em_atendimento',
  ATENDIDO = 'atendido',
  CANCELADO = 'cancelado'
}

export enum ResetTicket {
  NUNCA = 'nunca',
  DIARIO = 'diario',
  SEMANAL = 'semanal',
  MENSAL = 'mensal',
  ANUAL = 'anual',
  MANUAL = 'manual'
}

export enum TipoImpressora {
  TICKET = 'ticket',
  RELATORIO = 'relatorio',
  GERAL = 'geral'
}

// Interfaces
export interface Empresa {
  id: number;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  logo_url?: string;
  status: StatusAtivo;
  criado_em: string;
  atualizado_em: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  tipo: TipoUsuario;
  empresa_id?: number;
  empresa?: Empresa;
  status: StatusAtivo;
  criado_em: string;
}

export interface Local {
  id: number;
  nome: string;
  descricao?: string;
  empresa_id: number;
  empresa?: Empresa;
  status: StatusAtivo;
  criado_em: string;
}

export interface TipoTicket {
  id: number;
  nome: string;
  descricao?: string;
  prioridade: number;
  empresa_id: number;
  empresa?: Empresa;
  status: StatusAtivo;
  criado_em: string;
}

export interface Fila {
  id: number;
  nome: string;
  tipo_ticket_id: number;
  tipo_ticket?: TipoTicket;
  prefixo: string;
  tamanho_ticket: number;
  local_id: number;
  local?: Local;
  empresa_id: number;
  empresa?: Empresa;
  reset_ticket: ResetTicket;
  status: StatusAtivo;
  criado_em: string;
}

export interface ControleTicket {
  id: number;
  fila_id: number;
  referencia: string;
  ultimo_numero: number;
  criado_em: string;
}

export interface Guiche {
  id: number;
  nome: string;
  local_id: number;
  local?: Local;
  empresa_id: number;
  empresa?: Empresa;
  status_uso: StatusUsoGuiche;
  status_ativo: StatusAtivo;
  criado_em: string;
}

export interface Tela {
  id: number;
  nome: string;
  local_id: number;
  local?: Local;
  empresa_id: number;
  empresa?: Empresa;
  tipo_exibicao: TipoExibicao;
  status: StatusAtivo;
  criado_em: string;
}

export interface Publicidade {
  id: number;
  titulo: string;
  tipo_midia: TipoMidia;
  media_path?: string;
  duracao: number;
  tela_id: number;
  tela?: Tela;
  empresa_id: number;
  empresa?: Empresa;
  status: StatusAtivo;
  data_criacao: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface Ticket {
  id: number;
  numero: number;
  fila_id: number;
  fila?: Fila;
  empresa_id: number;
  empresa?: Empresa;
  status: StatusTicket;
  observacao?: string;
  chamado_por?: number;
  chamado_em?: string;
  atendimento_iniciado_em?: string;
  atendimento_finalizado_em?: string;
  guiche_id?: number;
  guiche?: Guiche;
  criado_em: string;
  usuario?: Usuario;
  ticket_completo?: string; // Prefixo + número formatado
}

export interface LogAtendimento {
  id: number;
  usuario_id: number;
  usuario?: Usuario;
  ticket_id: number;
  ticket?: Ticket;
  guiche_id?: number;
  guiche?: Guiche;
  acao: string;
  detalhes?: string;
  timestamp: string;
}

export interface Impressora {
  id: number;
  nome: string;
  modelo?: string;
  ip?: string;
  porta: number;
  local_id: number;
  local?: Local;
  empresa_id: number;
  empresa?: Empresa;
  tipo: TipoImpressora;
  largura_colunas: number;
  cabecalho?: string;
  rodape?: string;
  status: StatusAtivo;
  criado_em: string;
}

export interface DadosAutenticacao {
  email: string;
  senha: string;
}

export interface RespostaAutenticacao {
  usuario: Usuario;
  token: string;
}

export interface EstatisticasAtendimento {
  total: number;
  atendidos: number;
  cancelados: number;
  aguardando: number;
  em_atendimento: number;
  tempo_medio_espera: number;
  tempo_medio_atendimento: number;
}

export interface TicketParaEmissao {
  fila_id: number;
  observacao?: string;
}

export interface AlocacaoGuiche {
  usuario_id: number;
  guiche_id: number;
}