/**
 * Funções utilitárias para formatação de dados
 */

// Formatar data e hora (DD/MM/AAAA HH:MM)
export function formatarDataHora(dataString: string | undefined): string {
  if (!dataString) return '';
  
  const data = new Date(dataString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);
}

// Formatar apenas data (DD/MM/AAAA)
export function formatarData(dataString: string | undefined): string {
  if (!dataString) return '';
  
  const data = new Date(dataString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data);
}

// Formatar número do ticket (com prefixo e zeros à esquerda)
export function formatarNumeroTicket(prefixo: string, numero: number, tamanho: number): string {
  return `${prefixo}${numero.toString().padStart(tamanho, '0')}`;
}

// Formatar tempo em segundos para formato legível (HH:MM:SS)
export function formatarTempo(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;

  return [
    horas.toString().padStart(2, '0'),
    minutos.toString().padStart(2, '0'),
    segs.toString().padStart(2, '0')
  ].join(':');
}

// Formatar tempo em minutos para formato legível (Xh Ymin)
export function formatarTempoEmMinutos(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  if (horas > 0) {
    return `${horas}h ${mins}min`;
  }
  return `${mins} min`;
}

// Formatar para moeda brasileira (R$)
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Capitalizar primeira letra de cada palavra
export function capitalizarPalavras(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}

// Formatar nome de enum para exibição
export function formatarEnum(valor: string): string {
  return valor
    .split('_')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(' ');
}