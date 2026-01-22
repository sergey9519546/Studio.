import { createHmac } from 'crypto';

interface ZhipuJwtPayload {
  api_key: string;
  exp: number;
  timestamp: number;
}

const base64UrlEncode = (input: Buffer | string): string =>
  Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

export const createZhipuJwt = (
  apiKey: string,
  apiSecret: string,
  expiresInSeconds: number = 60
): string => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: ZhipuJwtPayload = {
    api_key: apiKey,
    exp: now + expiresInSeconds,
    timestamp: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const token = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlEncode(
    createHmac('sha256', apiSecret).update(token).digest()
  );

  return `${token}.${signature}`;
};
