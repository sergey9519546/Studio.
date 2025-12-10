
import { Storage } from '@google-cloud/storage';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars from root .env
const rootEnvPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: rootEnvPath });
console.log(`Loaded .env from: ${rootEnvPath}`);

async function verifyStorage() {
    console.log('--- Cloud Storage Verification ---');

    const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
    const bucketName = process.env.STORAGE_BUCKET || 'studio-roster-assets-main';
    const clientEmail = process.env.GCP_CLIENT_EMAIL;
    const privateKey = process.env.GCP_PRIVATE_KEY;
    const credentialsJson = process.env.GCP_CREDENTIALS;
    const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    console.log(`Project ID: ${projectId}`);
    console.log(`Target Bucket: ${bucketName}`);

    let storage: Storage;

    try {
        if (credentialsJson) {
            console.log('Method: GCP_CREDENTIALS (JSON)');
            const credentials = JSON.parse(credentialsJson) as Record<string, unknown>;
            storage = new Storage({ projectId, credentials });
        } else if (clientEmail && privateKey) {
            console.log('Method: ENV VARS (Client Email + Private Key)');
            storage = new Storage({
                projectId,
                credentials: {
                    client_email: clientEmail,
                    private_key: privateKey.replace(/\\n/g, '\n'),
                }
            });
        } else if (keyFile) {
            console.log('Method: GOOGLE_APPLICATION_CREDENTIALS (File)');
            storage = new Storage({ projectId, keyFilename: keyFile });
        } else {
            console.log('Method: Default (ADC)');
            storage = new Storage({ projectId });
        }

        const bucket = storage.bucket(bucketName);
        const [exists] = await bucket.exists();

        if (exists) {
            console.log(`✅ Bucket '${bucketName}' exists and is accessible.`);

            // Try writing a test file
            const testFileName = `verify-test-${Date.now()}.txt`;
            const file = bucket.file(testFileName);
            await file.save('Verification Test Content');
            console.log(`✅ Write permission confirmed (Uploaded ${testFileName})`);

            await file.delete();
            console.log(`✅ Delete permission confirmed (Deleted ${testFileName})`);

        } else {
            console.error(`❌ Bucket '${bucketName}' does NOT exist or is not accessible.`);
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Verification Failed: ${errorMessage}`);
        if (error instanceof Error && 'code' in error && error.code === 403) {
            console.error('   -> Permission Denied. Check Service Account roles.');
        }
    }
}

verifyStorage();
