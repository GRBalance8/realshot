#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

function checkNodeVersion() {
  const nvmrcPath = path.resolve(__dirname, '../.nvmrc');
  const requiredVersion = fs.readFileSync(nvmrcPath, 'utf8').trim();
  const currentVersion = process.version.slice(1); // Remove 'v' prefix
  
  if (!currentVersion.startsWith(requiredVersion)) {
    console.error(`🚫 Wrong Node.js version. Required: ${requiredVersion}, Current: ${currentVersion}`);
    console.log('📝 Tip: Use nvm to switch to the correct version:');
    console.log(`   nvm use ${requiredVersion}`);
    process.exit(1);
  }
}

function checkNpmVersion() {
  const requiredVersion = '9.6.7';
  const currentVersion = execSync('npm --version').toString().trim();
  
  if (currentVersion !== requiredVersion) {
    console.error(`🚫 Wrong npm version. Required: ${requiredVersion}, Current: ${currentVersion}`);
    console.log('📝 Tip: Install the correct npm version:');
    console.log(`   npm install -g npm@${requiredVersion}`);
    process.exit(1);
  }
}

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'DATABASE_URL',
    // Add other required env variables
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.error('🚫 Missing required environment variables:');
    missingVars.forEach(variable => {
      console.error(`   - ${variable}`);
    });
    console.log('📝 Tip: Make sure these are set in your .env file');
    process.exit(1);
  }
}

function main() {
  console.log('🔍 Checking development environment...');
  checkNodeVersion();
  checkNpmVersion();
  validateEnvironmentVariables();
  console.log('✅ Development environment is correctly configured!');
}

main();
