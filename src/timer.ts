
export default class Timer {
  private isCancelled: boolean = false;
  private duration: number;

  constructor(ms: number) {
    this.duration = ms;
  }

  /**
   * Starts the coutdown.
   *
   * @returns A promise that, when the timeout expires, rejects if cancel has
   * has been called. Otherwise, the promise fulfills.
   */
  public async start() {
    return new Promise((fulfill, reject) => setTimeout(this.isCancelled ? reject : fulfill, this.duration));
  }

  /**
   * Cancel the timer. Since there is no way to cancel a promise, causes start
   * to reject once the timeout expires.
   */
  public cancel() {
    this.isCancelled = true;
  }
}
