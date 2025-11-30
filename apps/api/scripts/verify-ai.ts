
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars from root .env
const rootEnvPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: rootEnvPath });

async function verifyAI() {
    console.log('--- AI Service Verification ---');

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error('❌ API_KEY is missing from .env');
        process.exit(1);
    }
    console.log('API_KEY found.');

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-flash';

        console.log(`Testing model: ${model}...`);
        const response = await ai.models.generateContent({
            model,
            contents: 'Reply with "AI Service Online" if you receive this.',
        });

        const text = response.text;
        if (text && text.includes('Online')) {
            console.log(`✅ AI Service Verified: ${text.trim()}`);
        } else {
            console.warn(`⚠️  AI Service responded, but unexpected output: ${text}`);
        }

    } catch (error: any) {
        console.error(`❌ Verification Failed: ${error.message}`);
    }
}

verifyAI();
