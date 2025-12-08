declare module "@google-cloud/aiplatform" {
  export const protos: any;
  export class PredictionServiceClient {
    constructor(options?: Record<string, unknown>);
    predict(request: Record<string, unknown>): Promise<any[]>;
  }
}

declare module "googleapis" {
  export const google: any;
  export const sheets_v4: any;
  export const docs_v1: any;
  export const drive_v3: any;
}
