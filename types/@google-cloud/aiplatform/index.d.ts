// Minimal type definitions for Google Cloud AI Platform
declare module '@google-cloud/aiplatform' {
  export class PredictionServiceClient {
    constructor(options?: any);
    predict(request: any): Promise<any>;
  }

  export class ModelServiceClient {
    constructor(options?: any);
    listModels(request: any): Promise<any>;
  }

  export class EndpointServiceClient {
    constructor(options?: any);
    listEndpoints(request: any): Promise<any>;
  }
}
