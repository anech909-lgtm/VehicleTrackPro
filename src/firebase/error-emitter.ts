
import { EventEmitter } from 'events';

type ErrorEvents = {
  'permission-error': (error: Error) => void;
};

class TypedEventEmitter<T extends Record<string, (...args: any[]) => void>> {
  private emitter = new EventEmitter();

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean {
    return this.emitter.emit(event as string, ...args);
  }

  on<K extends keyof T>(event: K, listener: T[K]): this {
    this.emitter.on(event as string, listener);
    return this;
  }

  off<K extends keyof T>(event: K, listener: T[K]): this {
    this.emitter.off(event as string, listener);
    return this;
  }
}

export const errorEmitter = new TypedEventEmitter<ErrorEvents>();
