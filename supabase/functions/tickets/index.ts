import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (path) {
      case 'emitir':
        if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Método não permitido' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        const { fila_id, observacao } = await req.json()

        // Validar dados
        if (!fila_id) {
          return new Response(JSON.stringify({ error: 'Fila não informada' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Buscar fila
        const { data: fila, error: filaError } = await supabase
          .from('filas')
          .select('*')
          .eq('id', fila_id)
          .single()

        if (filaError || !fila) {
          return new Response(JSON.stringify({ error: 'Fila não encontrada' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Gerar número do ticket
        const hoje = new Date().toISOString().split('T')[0]
        const { data: controle, error: controleError } = await supabase
          .from('controle_tickets')
          .select('*')
          .eq('fila_id', fila_id)
          .eq('referencia', hoje)
          .single()

        let numero = 1
        if (controle) {
          numero = controle.ultimo_numero + 1
          await supabase
            .from('controle_tickets')
            .update({ ultimo_numero: numero })
            .eq('id', controle.id)
        } else {
          await supabase
            .from('controle_tickets')
            .insert({
              fila_id,
              referencia: hoje,
              ultimo_numero: numero
            })
        }

        // Criar ticket
        const { data: ticket, error: ticketError } = await supabase
          .from('tickets')
          .insert({
            numero,
            fila_id,
            observacao,
            status: 'aguardando'
          })
          .select('*, fila(*)')
          .single()

        if (ticketError) {
          return new Response(JSON.stringify({ error: 'Erro ao criar ticket' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        return new Response(JSON.stringify(ticket), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'chamar':
        if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Método não permitido' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        const { ticket_id, guiche_id, usuario_id } = await req.json()

        // Validar dados
        if (!ticket_id || !guiche_id || !usuario_id) {
          return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Atualizar ticket
        const { data: ticketChamado, error: ticketChamadoError } = await supabase
          .from('tickets')
          .update({
            status: 'em_atendimento',
            chamado_por: usuario_id,
            chamado_em: new Date().toISOString(),
            guiche_id
          })
          .eq('id', ticket_id)
          .select('*, fila(*), guiche(*)')
          .single()

        if (ticketChamadoError) {
          return new Response(JSON.stringify({ error: 'Erro ao chamar ticket' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Registrar log
        await supabase
          .from('logs_atendimento')
          .insert({
            usuario_id,
            ticket_id,
            guiche_id,
            acao: 'chamada',
            detalhes: `Ticket ${ticketChamado.fila.prefixo}${ticketChamado.numero} chamado para ${ticketChamado.guiche.nome}`
          })

        return new Response(JSON.stringify(ticketChamado), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'finalizar':
        if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Método não permitido' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        const { ticket_id: ticketFinalizarId, usuario_id: usuarioFinalizarId } = await req.json()

        // Validar dados
        if (!ticketFinalizarId || !usuarioFinalizarId) {
          return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Atualizar ticket
        const { data: ticketFinalizado, error: ticketFinalizadoError } = await supabase
          .from('tickets')
          .update({
            status: 'atendido',
            atendimento_finalizado_em: new Date().toISOString()
          })
          .eq('id', ticketFinalizarId)
          .select('*, fila(*), guiche(*)')
          .single()

        if (ticketFinalizadoError) {
          return new Response(JSON.stringify({ error: 'Erro ao finalizar ticket' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Registrar log
        await supabase
          .from('logs_atendimento')
          .insert({
            usuario_id: usuarioFinalizarId,
            ticket_id: ticketFinalizarId,
            guiche_id: ticketFinalizado.guiche_id,
            acao: 'finalização',
            detalhes: `Ticket ${ticketFinalizado.fila.prefixo}${ticketFinalizado.numero} finalizado no ${ticketFinalizado.guiche.nome}`
          })

        return new Response(JSON.stringify(ticketFinalizado), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Rota não encontrada' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})