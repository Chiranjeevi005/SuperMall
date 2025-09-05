#!/usr/bin/env node

/**
 * Vercel Local Deployment Verification Script
 * 
 * This script helps verify that your Vercel deployment configuration is correct
 * before deploying to the cloud.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Vercel Local Deployment Verification\n');

// Check if vercel.json exists
console.log('1. Checking vercel.json configuration...');
if (!existsSync(path.join(__dirname, 'vercel.json'))) {
  console.error('❌ vercel.json not found!');
  process.exit(1);
}

try {
  const vercelConfig = JSON.parse(readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  console.log('✅ vercel.json found and valid');
  console.log(`   Version: ${vercelConfig.version}`);
  console.log(`   Builds: ${vercelConfig.builds?.length || 0} build(s) configured`);
  console.log(`   Routes: ${vercelConfig.routes?.length || 0} route(s) configured`);
  console.log(`   Environment variables: ${Object.keys(vercelConfig.env || {}).length} variable(s) configured`);
} catch (error) {
  console.error('❌ Error parsing vercel.json:', error.message);
  process.exit(1);
}

// Check if package.json exists and has required scripts
console.log('\n2. Checking package.json...');
if (!existsSync(path.join(__dirname, 'package.json'))) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

try {
  const packageJson = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('✅ package.json found');
  
  // Check for required scripts
  const requiredScripts = ['build', 'start'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);
  
  if (missingScripts.length > 0) {
    console.warn(`⚠️  Missing scripts: ${missingScripts.join(', ')}`);
  } else {
    console.log('✅ Required scripts found: build, start');
  }
} catch (error) {
  console.error('❌ Error parsing package.json:', error.message);
  process.exit(1);
}

// Check environment variables
console.log('\n3. Checking environment variables...');
const envFiles = ['.env.local', '.env'];
let envFound = false;

for (const envFile of envFiles) {
  if (existsSync(path.join(__dirname, envFile))) {
    console.log(`✅ ${envFile} found`);
    envFound = true;
    break;
  }
}

if (!envFound) {
  console.warn('⚠️  No .env or .env.local file found. Make sure to set environment variables in Vercel dashboard.');
}

// Check if Next.js is installed
console.log('\n4. Checking Next.js installation...');
try {
  execSync('npm list next', { stdio: 'pipe' });
  console.log('✅ Next.js is installed');
} catch (error) {
  console.error('❌ Next.js is not installed or not in dependencies');
  process.exit(1);
}

// Try to build the project (optional, uncomment if you want to test)
/*
console.log('\n5. Testing build process...');
try {
  console.log('   Building project (this may take a few minutes)...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
*/

console.log('\n✅ Vercel deployment verification completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Push your code to a Git repository');
console.log('2. Import the repository to Vercel');
console.log('3. Configure environment variables in the Vercel dashboard');
console.log('4. Deploy!');

console.log('\n📝 Environment variables to configure in Vercel:');
console.log('  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (from your .env.local file)');
console.log('  - NEXT_PUBLIC_API_URL (your Render backend URL)');

console.log('\n🚀 Your application is ready for Vercel deployment!');