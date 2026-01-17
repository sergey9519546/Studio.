import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

interface LoginResponse {
    access_token: string;
}

interface IndexResponse {
    success: boolean;
    data: {
        chunksIndexed: number;
        documentIds: string[];
    };
}

async function getToken(): Promise<string> {
    console.log('🔐 Authenticating...');

    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
        email: process.env.ADMIN_EMAIL || 'admin@studio.com',
        password: process.env.ADMIN_PASSWORD
    });

    console.log('✓ Authenticated\n');
    return response.data.access_token;
}

async function indexDocuments(token: string) {
    const documents = [
        {
            content: `# Authentication System

The Studio Roster application uses a robust JWT-based authentication system with bcrypt password hashing.

## Key Features:
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 60-minute expiration
- **Guards**: JwtAuthGuard protects all routes except /auth/login and /auth/register
- **Admin Seeding**: Automatic admin user creation on first startup

## Implementation:
The AuthService handles all authentication logic. Passwords are never stored in plain text.
JWT tokens are returned upon successful login and must be included in the Authorization header
for all protected endpoints.`,
            metadata: {
                title: 'Authentication System',
                source: 'docs/authentication.md',
                type: 'documentation',
                category: 'security'
            }
        },
        {
            content: `# Database Architecture

Studio Roster uses Prisma ORM with PostgreSQL (or SQLite for local development).

## Main Models:
- **User**: Stores user credentials (email, hashed password)
- **Project**: Creative projects with budgets, dates, and statuses
- **Freelancer**: Freelance talent pool with skills and rates
- **Assignment**: Links freelancers to projects
- **KnowledgeSource**: RAG document storage

## Relationships:
- Projects → RoleRequirements (one-to-many)
- Projects → Assignments (one-to-many)
- Freelancers → Assignments (one-to-many)
- Projects → KnowledgeSources (one-to-many)

All relations use cascade deletes for referential integrity.`,
            metadata: {
                title: 'Database Architecture',
                source: 'docs/database.md',
                type: 'documentation',
                category: 'architecture'
            }
        },
        {
            content: `# Vertex AI Integration

Studio Roster integrates Google Cloud's Vertex AI for all AI capabilities.

## Services:
1. **VertexAIService**: Text generation and chat
   - Model: gemini-1.5-pro
   - Methods: generateContent(), chat(), extractData()

2. **VertexAIEmbeddingsService**: Text embeddings
   - Model: text-embedding-gecko@003
   - Dimension: 768
   - Methods: generateEmbedding(), generateBatchEmbeddings()

3. **RAGService**: Retrieval-Augmented Generation
   - Document indexing with intelligent chunking
   - Hybrid search (semantic + keyword)
   - Conversational chat with context
   - Multi-document summarization

## Configuration:
Requires GCP_PROJECT_ID and Vertex AI API enabled. Service account must have
roles/aiplatform.user permission.`,
            metadata: {
                title: 'Vertex AI Integration',
                source: 'docs/ai-integration.md',
                type: 'documentation',
                category: 'ai'
            }
        },
        {
            content: `# Project Management Features

The application provides comprehensive project management capabilities for creative agencies.

## Core Features:
- **Project Creation**: Define budgets, timelines, and role requirements
- **Freelancer Management**: Skill-based talent database with availability tracking
- **Auto-Assignment**: AI-powered freelancer matching based on skills and requirements
- **Moodboards**: Visual assets collection with AI analysis
- **Scripts**: Creative content generation and management
- **Analytics**: Project insights and freelancer performance tracking

## Workflow:
1. Create project with role requirements
2. System suggests matching freelancers
3. Review and assign freelancers
4. Track progress and deliverables
5. Manage payments and invoices

Integration with Google Drive for asset storage.`,
            metadata: {
                title: 'Project Management',
                source: 'docs/features.md',
                type: 'documentation',
                category: 'features'
            }
        },
        {
            content: `# Deployment Guide

Studio Roster is designed for deployment on Google Cloud Run.

## Prerequisites:
- Docker installed
- Google Cloud SDK configured
- PostgreSQL database (Cloud SQL recommended)
- GCS bucket for file storage

## Steps:
1. Build Docker image (multi-stage build for optimization)
2. Push to Google Container Registry
3. Deploy to Cloud Run with environment variables
4. Configure custom domain and SSL
5. Set up Cloud Armor for DDoS protection

## Environment Variables:
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: Strong random secret (openssl rand -base64 32)
- GCP_PROJECT_ID: Your Google Cloud project
- STORAGE_BUCKET: GCS bucket name
- ADMIN_PASSWORD: Secure admin password

## Production Optimizations:
- Non-root user in Docker
- Health checks enabled
- Rate limiting (100 req/60sec)
- Production-only dependencies
- Automatic database migrations`,
            metadata: {
                title: 'Deployment Guide',
                source: 'docs/deployment.md',
                type: 'documentation',
                category: 'deployment'
            }
        }
    ];

    let totalChunks = 0;

    for (const doc of documents) {
        console.log(`📄 Indexing: ${doc.metadata.title}...`);

        try {
            const response = await axios.post<IndexResponse>(
                `${API_URL}/rag/index`,
                doc,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            totalChunks += response.data.data.chunksIndexed;
            console.log(`   ✓ Indexed ${response.data.data.chunksIndexed} chunks`);

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            console.error(`   ✗ Failed: ${responseMessage || message}`);
        }
    }

    console.log(`\n✅ Indexing complete! Total chunks: ${totalChunks}`);
}

async function main() {
    console.log('📚 Studio Roster - Document Indexing\n');
    console.log('=====================================\n');

    try {
        const token = await getToken();
        await indexDocuments(token);

        console.log('\n💡 Next steps:');
        console.log('   - Test queries: ts-node scripts/test-rag.ts');
        console.log('   - Check stats: GET /api/rag/stats');
        console.log('   - Try chat: POST /api/rag/chat');

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const responseData = (error as { response?: { data?: unknown } })?.response?.data;
        console.error('\n❌ Indexing failed:', responseData || message);
        process.exit(1);
    }
}

main();
