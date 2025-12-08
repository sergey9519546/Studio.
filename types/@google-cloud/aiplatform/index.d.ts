declare module "@google-cloud/aiplatform" {
  // Minimal declaration to satisfy TypeScript until upstream typings are available
  export const protos: any;

  export class PredictionServiceClient {
    constructor(options?: Record<string, unknown>);
    predict(request: Record<string, unknown>): Promise<any[]>;
  }
}
