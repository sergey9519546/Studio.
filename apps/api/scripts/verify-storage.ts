
import { applicationDefault, cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars from root .env
const rootEnvPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: rootEnvPath });
console.log(`Loaded .env from: ${rootEnvPath}`);

async function verifyStorage() {
    console.log('--- Cloud Storage Verification ---');

    const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
    const bucketName = process.env.STORAGE_BUCKET || (projectId ? `${projectId}.appspot.com` : "studio-roster-assets");
    const clientEmail = process.env.GCP_CLIENT_EMAIL;
    const privateKey = process.env.GCP_PRIVATE_KEY;
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GCP_CREDENTIALS;
    const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    let configType = 'default';
    if (credentialsJson) configType = 'json';
    else if (clientEmail && privateKey) configType = 'env';
    else if (keyFile) configType = 'file';
    console.log(`Configuration type detected: ${configType}`);

    console.log(`Project ID: ${projectId}`);
    console.log(`Target Bucket: ${bucketName}`);

    let credential: ReturnType<typeof applicationDefault> = applicationDefault();

    try {
        if (credentialsJson) {
            console.log('Method: GCP_CREDENTIALS (JSON)');
            const parsed = JSON.parse(credentialsJson) as Record<string, string>;
            const parsedClientEmail = parsed.client_email || parsed.clientEmail || clientEmail;
            const parsedPrivateKey = parsed.private_key || parsed.privateKey || privateKey;
            if (parsedClientEmail && parsedPrivateKey) {
                credential = cert({
                    projectId: parsed.project_id || parsed.projectId || projectId,
                    clientEmail: parsedClientEmail,
                    privateKey: parsedPrivateKey.replace(/\\n/g, '\n'),
                } as ServiceAccount);
            } else {
                console.warn('Inline JSON missing client_email/private_key, falling back to application default credentials');
                credential = applicationDefault();
            }
        } else if (clientEmail && privateKey) {
            console.log('Method: ENV VARS (Client Email + Private Key)');
            credential = cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            } as ServiceAccount);
        } else if (keyFile) {
            console.log('Method: GOOGLE_APPLICATION_CREDENTIALS (File)');
            credential = cert(keyFile);
        } else {
            console.log('Method: Default (ADC)');
            credential = applicationDefault();
        }

        const app = getApps()[0] || initializeApp({
            credential,
            projectId,
            storageBucket: bucketName,
        });

        const storage = getStorage(app);
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
