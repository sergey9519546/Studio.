// Shim for legacy RxJS TimeoutError import paths
export class TimeoutError extends Error {
  constructor(message = "Timeout has occurred") {
    super(message);
    this.name = "TimeoutError";
  }
}

export default TimeoutError;
