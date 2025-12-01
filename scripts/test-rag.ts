import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001/api';

async function testRAG() {
    console.log('🧪 Studio Roster - RAG System Test\n');
    console.log('====================================\n');

    try {
        // 1. Login
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: process.env.ADMIN_EMAIL || 'admin@studio.com',
            password: process.env.ADMIN_PASSWORD
        });
        const token = loginResponse.data.access_token;
        console.log('   ✓ Authenticated\n');

        // 2. Check current stats
        console.log('2️⃣ Checking current RAG stats...');
        const statsResponse = await axios.get(`${API_URL}/rag/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Documents indexed:', statsResponse.data.data.vectorStore.totalDocuments);
        console.log('   Cache size:', statsResponse.data.data.embeddingsCache.size);
        console.log('   Memory usage:', statsResponse.data.data.vectorStore.memoryUsage);
        console.log('');

        // 3. Test Q&A query
        console.log('3️⃣ Testing Q&A query...');
        console.log('   Question: "How does authentication work?"');
        const queryResponse = await axios.post(
            `${API_URL}/rag/query`,
            {
                question: 'How does authentication work in this application?',
                topK: 3,
                includeContext: true
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('\n   📝 Answer:');
        console.log('   ' + queryResponse.data.data.answer.split('\n').join('\n   '));

        console.log('\n   📚 Sources:');
        queryResponse.data.data.sources.forEach((source: { content: string; score: number }, i: number) => {
            console.log(`   ${i + 1}. Relevance: ${(source.score * 100).toFixed(1)}%`);
            console.log(`      ${source.content.substring(0, 100)}...`);
        });
        console.log('');

        // 4. Test conversational chat
        console.log('4️⃣ Testing conversational chat...');
        const chatResponse = await axios.post(
            `${API_URL}/rag/chat`,
            {
                message: 'What AI models are being used?',
                conversationHistory: [
                    {
                        role: 'user',
                        content: 'Tell me about the tech stack'
                    },
                    {
                        role: 'assistant',
                        content: 'The application uses NestJS backend, React frontend, Prisma ORM, and Vertex AI.'
                    }
                ],
                topK: 2
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('   💬 Chat response:');
        console.log('   ' + chatResponse.data.data.answer.split('\n').join('\n   '));
        console.log('');

        // 5. Test another query
        console.log('5️⃣ Testing deployment query...');
        const deployQuery = await axios.post(
            `${API_URL}/rag/query`,
            {
                question: 'How do I deploy this application to production?',
                topK: 3
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('   📝 Deployment answer:');
        console.log('   ' + deployQuery.data.data.answer.substring(0, 300) + '...');
        console.log('');

        // 6. Final stats
        console.log('6️⃣ Final statistics...');
        const finalStats = await axios.get(`${API_URL}/rag/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Cache after queries:', finalStats.data.data.embeddingsCache.size);
        console.log('   (Cache should have increased from query embeddings)');

        console.log('\n✅ All RAG tests passed!\n');

        console.log('💡 Try these queries yourself:');
        console.log('   • "What database does this use?"');
        console.log('   • "How do I create a new project?"');
        console.log('   • "What are the security features?"');
        console.log('   • "Tell me about the RAG system"');

    } catch (error: unknown) {
        console.error('\n❌ Test failed:');
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response: { status: number; data: { error?: string } | string } };
            console.error('   Status:', axiosError.response.status);
            console.error('   Error:', typeof axiosError.response.data === 'object' ? axiosError.response.data.error : axiosError.response.data);
        } else if (error instanceof Error) {
            console.error('   ', error.message);
        }
        process.exit(1);
    }
}

testRAG();
