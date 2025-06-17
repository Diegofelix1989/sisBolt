import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { soundService } from './sound';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(token: string): void {
    if (this.connected) return;

    this.socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token
      }
    });

    this.setupEventListeners();
    this.connected = true;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Conexão estabelecida
    this.socket.on('connect', () => {
      console.log('Conectado ao servidor de WebSocket');
    });

    // Erro de conexão
    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão WebSocket:', error);
      toast.error('Erro de conexão com o servidor');
    });

    // Novo ticket chamado
    this.socket.on('ticket:called', (data) => {
      soundService.playCallSound();
      toast.success(`Ticket ${data.ticket_completo} chamado para ${data.guiche.nome}`);
    });

    // Notificação para atendente
    this.socket.on('attendant:notification', (data) => {
      soundService.playNotificationSound();
      toast(data.message, {
        icon: data.type === 'success' ? '✅' : data.type === 'warning' ? '⚠️' : 'ℹ️'
      });
    });

    // Atualização de status do guichê
    this.socket.on('counter:status', (data) => {
      // Emitir evento personalizado para atualizar a UI
      const event = new CustomEvent('counter:status', { detail: data });
      window.dispatchEvent(event);
    });

    // Desconexão
    this.socket.on('disconnect', () => {
      console.log('Desconectado do servidor WebSocket');
      this.connected = false;
    });
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public emit(event: string, data: any): void {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = SocketService.getInstance();