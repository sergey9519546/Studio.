
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    console.log("Testing Google GenAI SDK...");
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("No API KEY");
        return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const models = ['gemini-1.5-flash', 'gemini-2.0-flash-exp'];

    for (const model of models) {
        console.log(`Testing model: ${model}`);
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: 'Say hello',
            });

            console.log("SUCCESS with " + model);
            console.log("TYPE OF response.text: " + typeof response.text);
            if (typeof response.text === 'function') {
                console.log("IS FUNCTION. Executing...");
                console.log("RESULT: " + response.text().substring(0, 50));
            } else {
                console.log("IS VALUE: " + response.text);
            }
            break; // Success
        } catch (e: any) {
            console.error(`Error with ${model}:`, e.message);
        }
    }
}

run();
