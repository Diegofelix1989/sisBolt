import { Howl } from 'howler';

class SoundService {
  private static instance: SoundService;
  private callSound: Howl;
  private notificationSound: Howl;
  private enabled: boolean = true;

  private constructor() {
    this.callSound = new Howl({
      src: ['/sounds/call.mp3'],
      volume: 1.0,
      preload: true
    });

    this.notificationSound = new Howl({
      src: ['/sounds/notification.mp3'],
      volume: 0.7,
      preload: true
    });
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  public playCallSound(): void {
    if (this.enabled) {
      this.callSound.play();
    }
  }

  public playNotificationSound(): void {
    if (this.enabled) {
      this.notificationSound.play();
    }
  }

  public toggleSound(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

export const soundService = SoundService.getInstance();