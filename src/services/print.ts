import { api } from './api';

class PrintService {
  private static instance: PrintService;

  private constructor() {}

  public static getInstance(): PrintService {
    if (!PrintService.instance) {
      PrintService.instance = new PrintService();
    }
    return PrintService.instance;
  }

  public async printTicket(ticketId: number): Promise<void> {
    try {
      await api.post(`/tickets/${ticketId}/print`);
    } catch (error) {
      console.error('Erro ao imprimir ticket:', error);
      throw new Error('Não foi possível imprimir o ticket');
    }
  }

  public async printReport(reportType: string, params: any): Promise<void> {
    try {
      await api.post('/reports/print', {
        type: reportType,
        params
      });
    } catch (error) {
      console.error('Erro ao imprimir relatório:', error);
      throw new Error('Não foi possível imprimir o relatório');
    }
  }

  public async testPrinter(printerId: number): Promise<void> {
    try {
      await api.post(`/printers/${printerId}/test`);
    } catch (error) {
      console.error('Erro ao testar impressora:', error);
      throw new Error('Não foi possível testar a impressora');
    }
  }
}

export const printService = PrintService.getInstance();