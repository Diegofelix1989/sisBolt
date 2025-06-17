import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          nome: string
          cnpj: string | null
          email: string | null
          telefone: string | null
          endereco: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          logo_url: string | null
          status: 'ativo' | 'inativo'
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          cnpj?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          logo_url?: string | null
          status?: 'ativo' | 'inativo'
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          logo_url?: string | null
          status?: 'ativo' | 'inativo'
          criado_em?: string
          atualizado_em?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          nome: string
          email: string
          tipo: 'master_admin' | 'admin' | 'atendente'
          empresa_id: string
          status: 'ativo' | 'inativo'
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          tipo?: 'master_admin' | 'admin' | 'atendente'
          empresa_id: string
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          tipo?: 'master_admin' | 'admin' | 'atendente'
          empresa_id?: string
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
      }
      locais: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          empresa_id: string
          status: 'ativo' | 'inativo'
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          empresa_id: string
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          empresa_id?: string
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
      }
      tipos_ticket: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          prioridade: number
          empresa_id: string
          status: 'ativo' | 'inativo'
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          prioridade?: number
          empresa_id: string
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          prioridade?: number
          empresa_id?: string
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
      }
      filas: {
        Row: {
          id: string
          nome: string
          tipo_ticket_id: string
          prefixo: string
          tamanho_ticket: number
          local_id: string
          empresa_id: string
          reset_ticket: 'nunca' | 'diario' | 'semanal' | 'mensal' | 'anual' | 'manual'
          status: 'ativo' | 'inativo'
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          tipo_ticket_id: string
          prefixo: string
          tamanho_ticket?: number
          local_id: string
          empresa_id: string
          reset_ticket?: 'nunca' | 'diario' | 'semanal' | 'mensal' | 'anual' | 'manual'
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo_ticket_id?: string
          prefixo?: string
          tamanho_ticket?: number
          local_id?: string
          empresa_id?: string
          reset_ticket?: 'nunca' | 'diario' | 'semanal' | 'mensal' | 'anual' | 'manual'
          status?: 'ativo' | 'inativo'
          criado_em?: string
        }
      }
      tickets: {
        Row: {
          id: string
          numero: number
          fila_id: string
          empresa_id: string
          status: 'aguardando' | 'em_atendimento' | 'atendido' | 'cancelado'
          observacao: string | null
          chamado_por: string | null
          chamado_em: string | null
          atendimento_iniciado_em: string | null
          atendimento_finalizado_em: string | null
          guiche_id: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          numero: number
          fila_id: string
          empresa_id: string
          status?: 'aguardando' | 'em_atendimento' | 'atendido' | 'cancelado'
          observacao?: string | null
          chamado_por?: string | null
          chamado_em?: string | null
          atendimento_iniciado_em?: string | null
          atendimento_finalizado_em?: string | null
          guiche_id?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          numero?: number
          fila_id?: string
          empresa_id?: string
          status?: 'aguardando' | 'em_atendimento' | 'atendido' | 'cancelado'
          observacao?: string | null
          chamado_por?: string | null
          chamado_em?: string | null
          atendimento_iniciado_em?: string | null
          atendimento_finalizado_em?: string | null
          guiche_id?: string | null
          criado_em?: string
        }
      }
    }
  }
}