import { supabase } from '../lib/supabase';

// Serviços para interagir com o Supabase
export class ApiService {
  // Empresas
  static async getEmpresas() {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('status', 'ativo')
      .order('nome');
    
    if (error) throw error;
    return data;
  }

  static async createEmpresa(empresa: any) {
    const { data, error } = await supabase
      .from('empresas')
      .insert(empresa)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateEmpresa(id: string, empresa: any) {
    const { data, error } = await supabase
      .from('empresas')
      .update(empresa)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteEmpresa(id: string) {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Usuários
  static async getUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        empresa:empresas(*)
      `)
      .order('nome');
    
    if (error) throw error;
    return data;
  }

  static async createUsuario(usuario: any) {
    // Primeiro criar o usuário na autenticação
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: usuario.email,
      password: usuario.senha,
      email_confirm: true
    });

    if (authError) throw authError;

    // Depois criar o registro na tabela usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        empresa_id: usuario.empresa_id
      })
      .select(`
        *,
        empresa:empresas(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUsuario(id: string, usuario: any) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(usuario)
      .eq('id', id)
      .select(`
        *,
        empresa:empresas(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteUsuario(id: string) {
    // Primeiro deletar da tabela usuarios
    const { error: userError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    
    if (userError) throw userError;

    // Depois deletar da autenticação
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;
  }

  // Locais
  static async getLocais() {
    const { data, error } = await supabase
      .from('locais')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data;
  }

  static async createLocal(local: any) {
    const { data, error } = await supabase
      .from('locais')
      .insert(local)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateLocal(id: string, local: any) {
    const { data, error } = await supabase
      .from('locais')
      .update(local)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteLocal(id: string) {
    const { error } = await supabase
      .from('locais')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Tipos de Ticket
  static async getTiposTicket() {
    const { data, error } = await supabase
      .from('tipos_ticket')
      .select('*')
      .order('prioridade', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createTipoTicket(tipo: any) {
    const { data, error } = await supabase
      .from('tipos_ticket')
      .insert(tipo)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTipoTicket(id: string, tipo: any) {
    const { data, error } = await supabase
      .from('tipos_ticket')
      .update(tipo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTipoTicket(id: string) {
    const { error } = await supabase
      .from('tipos_ticket')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Filas
  static async getFilas() {
    const { data, error } = await supabase
      .from('filas')
      .select(`
        *,
        tipo_ticket:tipos_ticket(*),
        local:locais(*)
      `)
      .order('nome');
    
    if (error) throw error;
    return data;
  }

  static async createFila(fila: any) {
    const { data, error } = await supabase
      .from('filas')
      .insert(fila)
      .select(`
        *,
        tipo_ticket:tipos_ticket(*),
        local:locais(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateFila(id: string, fila: any) {
    const { data, error } = await supabase
      .from('filas')
      .update(fila)
      .eq('id', id)
      .select(`
        *,
        tipo_ticket:tipos_ticket(*),
        local:locais(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteFila(id: string) {
    const { error } = await supabase
      .from('filas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Tickets
  static async getTickets(filtros?: any) {
    let query = supabase
      .from('tickets')
      .select(`
        *,
        fila:filas(*),
        guiche:guiches(*),
        usuario:usuarios(nome)
      `)
      .order('criado_em', { ascending: false });

    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }

    if (filtros?.fila_id) {
      query = query.eq('fila_id', filtros.fila_id);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  static async emitirTicket(dadosTicket: any) {
    const { data, error } = await supabase.functions.invoke('tickets/emitir', {
      body: dadosTicket
    });

    if (error) throw error;
    return data;
  }

  static async chamarTicket(ticketId: string, guicheId: string, usuarioId: string) {
    const { data, error } = await supabase.functions.invoke('tickets/chamar', {
      body: {
        ticket_id: ticketId,
        guiche_id: guicheId,
        usuario_id: usuarioId
      }
    });

    if (error) throw error;
    return data;
  }

  static async finalizarTicket(ticketId: string, usuarioId: string) {
    const { data, error } = await supabase.functions.invoke('tickets/finalizar', {
      body: {
        ticket_id: ticketId,
        usuario_id: usuarioId
      }
    });

    if (error) throw error;
    return data;
  }
}