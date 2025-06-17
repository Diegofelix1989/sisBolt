import { useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { soundService } from '../services/sound';

export function useNotifications() {
  // Solicitar permissão para notificações
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações desktop');
      return;
    }

    if (Notification.permission !== 'granted') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
        return false;
      }
    }

    return true;
  }, []);

  // Mostrar notificação
  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    const hasPermission = await requestPermission();
    
    if (hasPermission) {
      try {
        const notification = new Notification(title, {
          icon: '/icons/notification.png',
          badge: '/icons/badge.png',
          ...options
        });

        notification.onclick = function() {
          window.focus();
          notification.close();
        };

        soundService.playNotificationSound();
      } catch (error) {
        console.error('Erro ao mostrar notificação:', error);
        // Fallback para toast
        toast(title);
      }
    } else {
      // Fallback para toast
      toast(title);
    }
  }, [requestPermission]);

  // Solicitar permissão ao montar o componente
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return {
    showNotification
  };
}