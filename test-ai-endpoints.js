#!/usr/bin/env node
/**
 * AI Endpoint Manual Testing Script
 * 
 * Usage: node test-ai-endpoints.js
 * 
 * Tests all AI endpoints and measures performance
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Color output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(data),
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

async function testEndpoint(name, method, path, body) {
    log('blue', `\n🧪 Testing: ${name}`);

    const startTime = Date.now();

    try {
        const result = await makeRequest(method, path, body);
        const duration = Date.now() - startTime;

        if (result.status >= 200 && result.status < 300) {
            log('green', `✅ PASS (${duration}ms) - Status: ${result.status}`);
            console.log('Response:', JSON.stringify(result.data, null, 2).substring(0, 200));
        } else {
            log('red', `❌ FAIL (${duration}ms) - Status: ${result.status}`);
            console.log('Error:', result.data);
        }

        return { success: result.status < 300, duration };
    } catch (error) {
        const duration = Date.now() - startTime;
        log('red', `❌ ERROR (${duration}ms) - ${error.message}`);
        return { success: false, duration };
    }
}

async function runTests() {
    log('yellow', '\n🚀 AI Endpoint Testing Suite\n');
    log('yellow', '='.repeat(50));

    const results = [];

    // Test 1: Simple Chat
    results.push(await testEndpoint(
        'AI Chat - Simple Query',
        'POST',
        '/ai/chat',
        {
            message: 'Hello, what can you help me with?',
            conversationHistory: []
        }
    ));

    // Test 2: RAG Query (requires data)
    results.push(await testEndpoint(
        'RAG Query',
        'POST',
        '/rag/query',
        {
            query: 'What projects do we have?',
            projectId: 'test-project-id'
        }
    ));

    // Test 3: Data Extraction
    results.push(await testEndpoint(
        'AI Extract Data',
        'POST',
        '/ai/extract',
        {
            prompt: 'Extract key information: Project X costs $50k and runs for 3 months',
            schema: {
                type: 'object',
                properties: {
                    projectName: { type: 'string' },
                    budget: { type: 'number' },
                    duration: { type: 'string' }
                }
            }
        }
    ));

    // Test 4: Health Check
    results.push(await testEndpoint(
        'AI Health Check',
        'GET',
        '/ai/health',
        null
    ));

    // Test 5: RAG Health
    results.push(await testEndpoint(
        'RAG Health Check',
        'GET',
        '/rag/health',
        null
    ));

    // Summary
    log('yellow', '\n' + '='.repeat(50));
    log('yellow', '📊 Test Summary\n');

    const passed = results.filter(r => r.success).length;
    const failed = results.length - passed;
    const avgDuration = Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length);

    log('blue', `Total Tests: ${results.length}`);
    log('green', `Passed: ${passed}`);
    if (failed > 0) {
        log('red', `Failed: ${failed}`);
    }
    log('blue', `Average Response Time: ${avgDuration}ms`);

    log('yellow', '\n' + '='.repeat(50));

    if (failed === 0) {
        log('green', '\n✅ All tests passed!');
    } else {
        log('red', '\n⚠️  Some tests failed. Check server logs for details.');
    }
}

// Run tests
console.log('\nStarting in 2 seconds...\n');
setTimeout(() => {
    runTests().catch(error => {
        log('red', `\n❌ Test suite failed: ${error.message}`);
        process.exit(1);
    });
}, 2000);
