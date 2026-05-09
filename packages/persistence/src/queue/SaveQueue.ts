/**
 * SaveQueue manages debounced save operations with cancellation support.
 * When a new operation is queued before the pending one executes,
 * the pending operation is cancelled.
 */

export interface SaveOperation<T = void> {
  execute: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export interface SaveQueueConfig {
  /** Debounce delay in milliseconds */
  delay: number;
}

export class SaveQueue {
  private pendingOperation: SaveOperation | null = null;
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly delay: number;

  constructor(config: SaveQueueConfig) {
    this.delay = config.delay;
  }

  /**
   * Queue a save operation. If one is already pending, it will be cancelled.
   */
  async queue<T = void>(operation: SaveOperation<T>): Promise<T> {
    // Cancel any pending operation
    this.cancel();

    // Store the new operation and schedule execution
    this.pendingOperation = operation;

    return new Promise((resolve, reject) => {
      this.timeoutId = setTimeout(async () => {
        try {
          if (this.pendingOperation === operation) {
            const result = await operation.execute();
            operation.onSuccess?.(result);
            this.pendingOperation = null;
            this.timeoutId = null;
            resolve(result);
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          operation.onError?.(err);
          this.pendingOperation = null;
          this.timeoutId = null;
          reject(err);
        }
      }, this.delay);
    });
  }

  /**
   * Cancel the pending operation without executing it.
   */
  private cancel(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.pendingOperation !== null) {
      this.pendingOperation.onCancel?.();
      this.pendingOperation = null;
    }
  }

  /**
   * Flush the pending operation immediately (execute without waiting).
   */
  async flush(): Promise<void> {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.pendingOperation !== null) {
      const operation = this.pendingOperation;
      this.pendingOperation = null;

      try {
        const result = await operation.execute();
        operation.onSuccess?.(result);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        operation.onError?.(err);
      }
    }
  }

  /**
   * Check if there's a pending operation
   */
  hasPending(): boolean {
    return this.pendingOperation !== null;
  }
}
