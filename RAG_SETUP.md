# RAG System Setup Guide

## 🚀 Quick Setup

### 1. Configure GCP Project

```bash
# Get your current project ID
gcloud config get-value project

# Or set a specific project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
```

### 2. Update .env File

Add to your `.env`:

```bash
# GCP Configuration
GCP_PROJECT_ID="your-project-id-here"
GCP_LOCATION="us-central1"

# Service Account (optional if using Application Default Credentials)
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

**Quick setup:**
```powershell
# On Windows PowerShell
$PROJECT_ID = gcloud config get-value project
(Get-Content .env) -replace 'GCP_PROJECT_ID=.*', "GCP_PROJECT_ID=`"$PROJECT_ID`"" | Set-Content .env
```

### 3. Setup Service Account Permissions

#### Option A: Use Application Default Credentials (Recommended for Local Dev)

```bash
# Authenticate with your Google account
gcloud auth application-default login

# This automatically grants you Vertex AI permissions
```

#### Option B: Create a Service Account

```bash
# Create service account
gcloud iam service-accounts create studio-roster-rag \
  --display-name="Studio Roster RAG Service Account"

# Grant Vertex AI User permission
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:studio-roster-rag@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Download key
gcloud iam service-accounts keys create service-account-key.json \
  --iam-account=studio-roster-rag@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Update .env
echo 'GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"' >> .env
```

---

## 📚 Index Documents

### Method 1: Via API Endpoint

```bash
# Start the server first
npm run dev

# Then in another terminal, index a document
curl -X POST http://localhost:3001/api/v1/rag/index \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "This is a comprehensive guide to our authentication system. We use bcrypt for password hashing with 10 salt rounds. JWT tokens are issued with a 60-minute expiration. All protected routes require the JwtAuthGuard.",
    "metadata": {
      "title": "Authentication Guide",
      "source": "docs/authentication.md",
      "type": "documentation",
      "projectId": "your-project-id"
    }
  }'
```

### Method 2: Using the Test Script

Create `scripts/index-docs.ts`:

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

// Login first to get JWT token
async function getToken() {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: 'admin@studio.com',
    password: process.env.ADMIN_PASSWORD
  });
  return response.data.access_token;
}

// Index documents
async function indexDocuments() {
  const token = await getToken();
  
  const documents = [
    {
      content: `# Authentication System\n\nOur application uses JWT-based authentication with bcrypt password hashing. All API endpoints except /auth/login and /auth/register are protected by JwtAuthGuard.`,
      metadata: {
        title: 'Authentication Overview',
        source: 'docs/auth.md',
        type: 'documentation'
      }
    },
    {
      content: `# Database Schema\n\nWe use Prisma with PostgreSQL. Main models include User, Project, Freelancer, Assignment, and KnowledgeSource. The User model has a password field that stores bcrypt-hashed passwords.`,
      metadata: {
        title: 'Database Schema',
        source: 'docs/database.md',
        type: 'documentation'
      }
    },
    {
      content: `# Vertex AI Integration\n\nWe use Vertex AI for all AI features. The VertexAIService provides generateContent(), chat(), and extractData() methods. Embeddings use the text-embedding-gecko@003 model.`,
      metadata: {
        title: 'AI Integration',
        source: 'docs/ai.md',
        type: 'documentation'
      }
    }
  ];

  for (const doc of documents) {
    console.log(`Indexing: ${doc.metadata.title}...`);
    
    const response = await axios.post(
      `${API_URL}/rag/index`,
      doc,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`✓ Indexed ${response.data.data.chunksIndexed} chunks`);
  }
  
  console.log('\n✅ All documents indexed!');
}

indexDocuments().catch(console.error);
```

Run it:
```bash
ts-node scripts/index-docs.ts
```

---

## 🔍 Query the RAG System

### Simple Q&A Query

```typescript
// Query example
const response = await axios.post(
  'http://localhost:3001/api/v1/rag/query',
  {
    question: 'How does authentication work in this application?',
    topK: 5,
    includeContext: true
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

console.log('Answer:', response.data.data.answer);
console.log('Sources:', response.data.data.sources.length);
console.log('Relevance Scores:', response.data.data.sources.map(s => s.score));
```

### Conversational Chat

```typescript
// Chat with conversation history
const chatResponse = await axios.post(
  'http://localhost:3001/api/v1/rag/chat',
  {
    message: 'What database do we use?',
    conversationHistory: [
      { role: 'user', content: 'Tell me about the authentication system' },
      { role: 'assistant', content: 'We use JWT-based auth with bcrypt...' }
    ],
    topK: 3
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

console.log('Response:', chatResponse.data.data.answer);
```

### Multi-Document Summarization

```typescript
// Summarize multiple documents
const summaryResponse = await axios.post(
  'http://localhost:3001/api/v1/rag/summarize',
  {
    documentIds: ['doc_id_1', 'doc_id_2', 'doc_id_3']
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

console.log('Summary:', summaryResponse.data.data.summary);
```

---

## 📊 Check RAG Status

```bash
# Get system statistics
curl http://localhost:3001/api/v1/rag/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response:
{
  "success": true,
  "data": {
    "vectorStore": {
      "totalDocuments": 15,
      "memoryUsage": "4.32 MB"
    },
    "embeddingsCache": {
      "size": 47,
      "maxSize": 1000,
      "ttl": 3600000
    }
  }
}
```

---

## 🧪 Complete Test Script

Create `scripts/test-rag.ts`:

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

async function testRAG() {
  console.log('🧪 Testing RAG System\n');

  // 1. Login
  console.log('1️⃣ Logging in...');
  const loginResponse = await axios.post(`${API_URL}/auth/login`, {
    email: 'admin@studio.com',
    password: process.env.ADMIN_PASSWORD
  });
  const token = loginResponse.data.access_token;
  console.log('✓ Logged in\n');

  // 2. Index a test document
  console.log('2️⃣ Indexing test document...');
  const indexResponse = await axios.post(
    `${API_URL}/rag/index`,
    {
      content: `The Studio Roster application is built with NestJS backend and React frontend. 
      It uses Prisma ORM for database access and Vertex AI for AI capabilities. 
      Authentication is handled via JWT tokens with bcrypt password hashing.`,
      metadata: {
        title: 'System Overview',
        source: 'test-doc.md',
        type: 'test'
      }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log(`✓ Indexed ${indexResponse.data.data.chunksIndexed} chunks\n`);

  // 3. Query the RAG system
  console.log('3️⃣ Querying RAG system...');
  const queryResponse = await axios.post(
    `${API_URL}/rag/query`,
    {
      question: 'What technologies are used in the Studio Roster application?',
      topK: 3
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  console.log('Answer:', queryResponse.data.data.answer);
  console.log('\nSources:');
  queryResponse.data.data.sources.forEach((source: any, i: number) => {
    console.log(`  ${i + 1}. Score: ${(source.score * 100).toFixed(1)}%`);
    console.log(`     Content: ${source.content.substring(0, 80)}...`);
  });
  
  // 4. Check statistics
  console.log('\n4️⃣ Checking statistics...');
  const statsResponse = await axios.get(`${API_URL}/rag/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Stats:', JSON.stringify(statsResponse.data.data, null, 2));
  
  console.log('\n✅ RAG system test complete!');
}

testRAG().catch(error => {
  console.error('❌ Test failed:', error.response?.data || error.message);
  process.exit(1);
});
```

Run:
```bash
ts-node scripts/test-rag.ts
```

---

## 🎯 Production Checklist

Before deploying:

- [ ] **GCP_PROJECT_ID** set in `.env`
- [ ] **Vertex AI API** enabled in GCP
- [ ] **Service account** has `roles/aiplatform.user` permission
- [ ] **Documents indexed** via `/api/v1/rag/index`
- [ ] **Test queries** working via `/api/v1/rag/query`
- [ ] **Cache statistics** showing reasonable hit rates
- [ ] **Memory usage** acceptable for your documents

---

## 💡 Tips

1. **Embeddings are cached** - First query generates embeddings (~2-3 seconds), subsequent queries use cache (~200ms)

2. **Chunk size matters** - Default 800 chars works well for most docs. Adjust in `ChunkingService` if needed.

3. **Hybrid search** - Combines semantic similarity (70%) + keyword matching (30%). Tune weights in `VectorStoreService.hybridSearch()`

4. **Top-K selection** - Default K=5 for queries, K=3 for chat. More = better context but slower.

5. **Project filtering** - Add `projectId` to metadata for project-specific RAG

---

## 🐛 Troubleshooting

### "Permission denied" error
```bash
# Make sure you're authenticated
gcloud auth application-default login

# Or check service account has correct role
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:studio-roster-rag@*"
```

### "Model not found" error
```bash
# Verify Vertex API is enabled
gcloud services list --enabled | findstr aiplatform

# If not:
gcloud services enable aiplatform.googleapis.com
```

### Slow embedding generation
- First query is slow (generates embeddings)
- Subsequent queries use cache
- Use batch indexing for many documents
- Consider increasing cache size in `EmbeddingsService`

---

## 📚 Further Reading

- [Vertex AI Embeddings Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/get-text-embeddings)
- [RAG Best Practices](https://cloud.google.com/vertex-ai/docs/generative-ai/rag/rag-overview)
- [Semantic Search Guide](https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/semantic-search)
