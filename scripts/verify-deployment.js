#!/usr/bin/env node

/**
 * Pre-Deployment Verification Script
 * Tests all the fixes applied during the deep scan and error fixing process
 *
 * Run with: node scripts/verify-deployment.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Studio Roster - Pre-Deployment Verification Script');
console.log('==================================================\n');

// Test counters
let passed = 0;
let failed = 0;
let total = 9;

function logResult(testName, success, details = '') {
  const status = success ? '✅' : '❌';
  const result = success ? 'PASS' : 'FAIL';

  if (success) {
    passed++;
    console.log(`${status} ${testName}: ${result}`);
  } else {
    failed++;
    console.log(`${status} ${testName}: ${result}`);
    if (details) console.log(`   Details: ${details}`);
  }
}

try {
  // 1. Check if environment file exists
  console.log('1. Testing .env configuration...');
  const envExists = fs.existsSync('.env');
  logResult('Environment file exists', envExists);

  if (envExists) {
    const envContent = fs.readFileSync('.env', 'utf8');

    // Check for critical environment variables
    const hasDatabaseUrl = envContent.includes('DATABASE_URL=') && !envContent.includes('DATABASE_URL=""');
    const hasJwtSecret = envContent.includes('JWT_SECRET=') && !envContent.includes('JWT_SECRET=""') && !envContent.includes('JWT_SECRET="temp"');
    const hasProductionNodeEnv = envContent.includes('NODE_ENV=production');
    const hasAllowedOrigins = envContent.includes('ALLOWED_ORIGINS=');
    const hasAdminEmail = envContent.includes('ADMIN_EMAIL=') && !envContent.includes('ADMIN_EMAIL=""');
    const hasAdminPassword = envContent.includes('ADMIN_PASSWORD=') && !envContent.includes('ADMIN_PASSWORD=""');

    logResult('DATABASE_URL configured', hasDatabaseUrl);
    logResult('JWT_SECRET configured', hasJwtSecret);
    logResult('NODE_ENV set to production', hasProductionNodeEnv);
    logResult('CORS ALLOWED_ORIGINS configured', hasAllowedOrigins);
    logResult('Admin credentials configured', hasAdminEmail && hasAdminPassword);
  }

  // 2. Check if Atlaskit icon fixes are in place
  console.log('\n2. Testing Atlaskit icon fixes...');
  const iconFix1 = fs.existsSync('node_modules/@atlaskit/icon/dist/esm/migration/cross-circle.js');
  const iconFix2 = fs.existsSync('node_modules/@atlaskit/icon/dist/esm/migration/index.js');

  logResult('Cross-circle icon shim exists', iconFix1);
  logResult('Migration index file exists', iconFix2);

  if (iconFix1) {
    const iconContent = fs.readFileSync('node_modules/@atlaskit/icon/dist/esm/migration/cross-circle.js', 'utf8');
    const hasReactComponent = iconContent.includes('React.forwardRef') && iconContent.includes('CrossCircleIcon');
    logResult('Cross-circle icon is valid React component', hasReactComponent);
  }

  // 3. Test TypeScript build configuration
  console.log('\n3. Testing TypeScript build fixes...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const buildApiScript = packageJson.scripts?.['build:api'];

  const hasDirectTscBuild = buildApiScript && buildApiScript.includes('npx tsc --project apps/api/tsconfig.app.json');
  logResult('API build script uses direct TypeScript compilation', hasDirectTscBuild);

  const hasCorrectBuild = packageJson.scripts?.['build'] &&
                         packageJson.scripts['build'].includes('npm run build:client && npm run build:api');
  logResult('Main build script includes both frontend and backend', hasCorrectBuild);

  // 4. Check Prisma configuration
  console.log('\n4. Testing database configuration...');
  const prismaConfigExists = fs.existsSync('prisma/prisma.config.ts');
  logResult('Prisma config file exists', prismaConfigExists);

  if (prismaConfigExists) {
    const prismaConfig = fs.readFileSync('prisma/prisma.config.ts', 'utf8');
    const usesEnvDbUrl = prismaConfig.includes('process.env.DATABASE_URL');
    logResult('Prisma uses environment DATABASE_URL', usesEnvDbUrl);
  }

  const schemaExists = fs.existsSync('prisma/schema.prisma');
  logResult('Prisma schema exists', schemaExists);

  // 5. API structure validation
  console.log('\n5. Testing API structure...');
  const mainTsExists = fs.existsSync('apps/api/src/main.ts');
  const appModuleExists = fs.existsSync('apps/api/src/app.module.ts');

  logResult('API main.ts exists', mainTsExists);
  logResult('API app.module.ts exists', appModuleExists);

  if (mainTsExists) {
    const mainContent = fs.readFileSync('apps/api/src/main.ts', 'utf8');
    const hasSecurityHeaders = mainContent.includes('helmet') && mainContent.includes('contentSecurityPolicy');
    const hasCors = mainContent.includes('enableCors');
    const hasValidationPipe = mainContent.includes('ValidationPipe');
    const hasJwtSecret = mainContent.includes('JWT_SECRET');

    logResult('Security headers (Helmet) configured', hasSecurityHeaders);
    logResult('CORS configuration present', hasCors);
    logResult('Global validation pipe configured', hasValidationPipe);
    logResult('References JWT_SECRET environment variable', hasJwtSecret);
  }

  // Summary
  console.log('\n==================================================');
  console.log(`✅ PASSED: ${passed}/${total} tests`);
  console.log(`❌ FAILED: ${failed}/${total} tests`);

  const passRate = Math.round((passed / total) * 100);
  console.log(`📊 PASS RATE: ${passRate}%`);

  if (failed > 0) {
    console.log('\n⚠️  Some fixes need attention before deployment.');
    process.exit(1);
  } else {
    console.log('\n🎉 All deployment fixes verified! Ready for production.');
    console.log('\nNext steps:');
    console.log('1. Test database connectivity: npx prisma generate && npx prisma db push');
    console.log('2. Test API startup: npm run start:dev');
    console.log('3. Test full build: npm run build');
    console.log('4. Deploy to production environment');
  }

} catch (error) {
  console.error('❌ Script execution failed:', error.message);
  process.exit(1);
}
