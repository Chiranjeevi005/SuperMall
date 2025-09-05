#!/usr/bin/env node

/**
 * Simple Vercel Deployment Helper Script
 * 
 * This script provides guidance for deploying to Vercel
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Super Mall Vercel Deployment Helper\n');

// Check if we're in the correct directory
if (!existsSync(path.join(__dirname, 'package.json'))) {
  console.error('❌ package.json not found! Please run this script from the project root directory.');
  process.exit(1);
}

console.log('✅ Project directory verified\n');

// Display deployment instructions
console.log('📋 Vercel Deployment Instructions:\n');

console.log('1. Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)');

console.log('\n2. Install Vercel CLI (if not already installed):');
console.log('   npm install -g vercel');

console.log('\n3. Login to Vercel:');
console.log('   vercel login');

console.log('\n4. Set the required environment variables in your Vercel project:');
console.log('   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
console.log('   Value: pk_test_51S0mgIC3epDJYUCX65Pc4krOpWgtN1ulXltemgAo661PmhefeXbs6TBIT5CNORrL39TWEnfHIyupSZdnAg9X4Iak00CNZg0h3I');
console.log('\n   vercel env add NEXT_PUBLIC_API_URL');
console.log('   Value: https://supermall-cevd.onrender.com');

console.log('\n5. Deploy to Vercel:');
console.log('   vercel --yes');

console.log('\n6. For production deployment:');
console.log('   vercel --prod');

console.log('\n📝 IMPORTANT: Environment Variables');
console.log('You MUST set these environment variables in the Vercel dashboard:');
console.log('- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_51S0mgIC3epDJYUCX65Pc4krOpWgtN1ulXltemgAo661PmhefeXbs6TBIT5CNORrL39TWEnfHIyupSZdnAg9X4Iak00CNZg0h3I');
console.log('- NEXT_PUBLIC_API_URL = https://supermall-cevd.onrender.com');

console.log('\n⚠️  Make sure your Render backend is deployed and running at:');
console.log('   https://supermall-cevd.onrender.com');

console.log('\n✅ Your Super Mall application is ready for Vercel deployment!');
console.log('Follow the steps above to deploy successfully.');