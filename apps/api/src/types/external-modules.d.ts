declare module "@google-cloud/aiplatform" {
  export const protos: unknown;
  export class PredictionServiceClient {
    constructor(options?: Record<string, unknown>);
    predict(request: Record<string, unknown>): Promise<unknown[]>;
  }
}

declare module "googleapis" {
  export const google: Record<string, unknown>;
  export const sheets_v4: Record<string, unknown>;
  export const docs_v1: Record<string, unknown>;
  export const drive_v3: Record<string, unknown>;
}
