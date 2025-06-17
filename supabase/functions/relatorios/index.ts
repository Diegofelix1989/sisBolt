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
      case 'atendimentos':
        const { data_inicio, data_fim, local_id } = await req.json()

        // Validar dados
        if (!data_inicio || !data_fim) {
          return new Response(JSON.stringify({ error: 'Período não informado' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Construir query base
        let query = supabase
          .from('tickets')
          .select(`
            *,
            fila (
              id,
              nome,
              prefixo,
              local_id
            ),
            guiche (
              id,
              nome,
              local_id
            ),
            usuario:chamado_por (
              id,
              nome
            )
          `)
          .gte('criado_em', data_inicio)
          .lte('criado_em', data_fim)

        // Filtrar por local
        if (local_id) {
          query = query.eq('fila.local_id', local_id)
        }

        const { data: tickets, error: ticketsError } = await query

        if (ticketsError) {
          return new Response(JSON.stringify({ error: 'Erro ao buscar atendimentos' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Calcular estatísticas
        const estatisticas = {
          total: tickets.length,
          atendidos: tickets.filter(t => t.status === 'atendido').length,
          cancelados: tickets.filter(t => t.status === 'cancelado').length,
          aguardando: tickets.filter(t => t.status === 'aguardando').length,
          em_atendimento: tickets.filter(t => t.status === 'em_atendimento').length,
          tempo_medio_espera: 0,
          tempo_medio_atendimento: 0
        }

        // Calcular tempos médios
        const ticketsFinalizados = tickets.filter(t => t.status === 'atendido' && t.chamado_em && t.atendimento_finalizado_em)
        if (ticketsFinalizados.length > 0) {
          const tempoEsperaTotal = ticketsFinalizados.reduce((total, t) => {
            const espera = new Date(t.chamado_em).getTime() - new Date(t.criado_em).getTime()
            return total + espera
          }, 0)
          
          const tempoAtendimentoTotal = ticketsFinalizados.reduce((total, t) => {
            const atendimento = new Date(t.atendimento_finalizado_em).getTime() - new Date(t.chamado_em).getTime()
            return total + atendimento
          }, 0)

          estatisticas.tempo_medio_espera = Math.round(tempoEsperaTotal / ticketsFinalizados.length / 60000) // em minutos
          estatisticas.tempo_medio_atendimento = Math.round(tempoAtendimentoTotal / ticketsFinalizados.length / 60000) // em minutos
        }

        return new Response(JSON.stringify({
          tickets,
          estatisticas
        }), {
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