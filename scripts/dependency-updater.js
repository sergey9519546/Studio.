#!/usr/bin/env node

/**
 * Automated Dependency Update System
 * Comprehensive dependency management and update automation
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class DependencyUpdater {
  constructor() {
    this.config = this.loadConfig();
    this.results = {
      updated: [],
      skipped: [],
      failed: [],
      security: []
    };
    this.backupDir = path.join(process.cwd(), 'backup', `dep-update-${Date.now()}`);
  }

  loadConfig() {
    const configPath = path.join(process.cwd(), 'dependency-update.config.js');
    if (fs.existsSync(configPath)) {
      return require(configPath);
    }
    
    // Default configuration
    return {
      strategies: {
        production: {
          patch: true,      // Auto-update patches
          minor: true,      // Auto-update minors for non-critical
          major: false,     // Manual approval for major versions
          critical: true    // Auto-update security critical
        },
        development: {
          patch: true,
          minor: true,
          major: false,
          critical: true
        }
      },
      ignore: [
        '@nestjs/core', // Major version updates require manual review
        'typescript',
        'react',
        'react-dom'
      ],
      testCommand: 'npm run test',
      buildCommand: 'npm run build',
      maxRetries: 3,
      backup: true,
      notifications: {
        slack: null,
        email: null,
        discord: null
      }
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async run() {
    this.log('🚀 Starting Automated Dependency Update', 'cyan');
    this.log(`📅 Timestamp: ${new Date().toISOString()}`, 'cyan');

    try {
      await this.backupDependencies();
      await this.scanDependencies();
      await this.checkVulnerabilities();
      await this.updateDependencies();
      await this.verifyUpdates();
      await this.cleanup();
      await this.generateReport();
      
      this.log('✅ Dependency update process completed!', 'green');
    } catch (error) {
      this.log(`❌ Error during update process: ${error.message}`, 'red');
      await this.rollback();
      throw error;
    }
  }

  async backupDependencies() {
    if (!this.config.backup) return;
    
    this.log('📦 Creating backup...', 'yellow');
    
    try {
      fs.mkdirSync(this.backupDir, { recursive: true });
      
      // Backup package.json
      fs.copyFileSync(
        path.join(process.cwd(), 'package.json'),
        path.join(this.backupDir, 'package.json')
      );
      
      // Backup lock file
      const lockFile = this.getLockFile();
      if (fs.existsSync(lockFile)) {
        fs.copyFileSync(lockFile, path.join(this.backupDir, path.basename(lockFile)));
      }
      
      this.log(`✅ Backup created at: ${this.backupDir}`, 'green');
    } catch (error) {
      this.log(`⚠️  Backup failed: ${error.message}`, 'yellow');
    }
  }

  async scanDependencies() {
    this.log('🔍 Scanning dependencies...', 'blue');
    
    try {
      const output = execSync('npm list --json', { encoding: 'utf8' });
      this.dependencies = JSON.parse(output);
      
      this.log(`📊 Found ${Object.keys(this.dependencies.dependencies || {}).length} production dependencies`);
      this.log(`📊 Found ${Object.keys(this.dependencies.devDependencies || {}).length} dev dependencies`);
      
    } catch (error) {
      this.log(`❌ Failed to scan dependencies: ${error.message}`, 'red');
      throw error;
    }
  }

  async checkVulnerabilities() {
    this.log('🔒 Checking security vulnerabilities...', 'blue');
    
    try {
      const output = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(output);
      
      if (audit.vulnerabilities) {
        Object.entries(audit.vulnerabilities).forEach(([name, vuln]) => {
          this.results.security.push({
            package: name,
            severity: vuln.severity,
            title: vuln.title,
            url: vuln.url
          });
        });
        
        this.log(`🚨 Found ${Object.keys(audit.vulnerabilities).length} vulnerabilities`, 'red');
      } else {
        this.log('✅ No security vulnerabilities found', 'green');
      }
      
    } catch (error) {
      this.log(`⚠️  Security scan failed: ${error.message}`, 'yellow');
    }
  }

  async updateDependencies() {
    this.log('⬆️  Updating dependencies...', 'blue');
    
    const dependencyTypes = ['dependencies', 'devDependencies'];
    
    for (const depType of dependencyTypes) {
      const deps = this.dependencies[depType] || {};
      
      for (const [name, currentVersion] of Object.entries(deps)) {
        await this.updateSinglePackage(name, currentVersion, depType);
      }
    }
  }

  async updateSinglePackage(name, currentVersion, depType) {
    if (this.shouldIgnore(name)) {
      this.results.skipped.push({ name, reason: 'Ignored pattern' });
      return;
    }

    try {
      this.log(`🔄 Checking ${name}@${currentVersion}...`, 'cyan');
      
      const latestVersion = await this.getLatestVersion(name);
      const updateType = semver.diff(currentVersion, latestVersion);
      
      if (!updateType) {
        this.results.skipped.push({ name, reason: 'Already latest' });
        return;
      }

      if (this.shouldAutoUpdate(name, updateType, depType)) {
        await this.updatePackage(name, latestVersion, depType);
        this.results.updated.push({ name, from: currentVersion, to: latestVersion, type: updateType });
      } else {
        this.results.skipped.push({ name, reason: `Manual approval required for ${updateType}` });
      }
      
    } catch (error) {
      this.results.failed.push({ name, error: error.message });
      this.log(`❌ Failed to update ${name}: ${error.message}`, 'red');
    }
  }

  shouldIgnore(name) {
    return this.config.ignore.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(name);
      }
      return name === pattern;
    });
  }

  shouldAutoUpdate(name, updateType, depType) {
    const strategy = this.config.strategies[depType] || this.config.strategies.production;
    
    if (updateType === 'patch') return strategy.patch;
    if (updateType === 'minor') return strategy.minor;
    if (updateType === 'major') return strategy.major;
    
    // Security updates are always applied
    return strategy.critical;
  }

  async getLatestVersion(packageName) {
    try {
      const output = execSync(`npm view ${packageName} version`, { encoding: 'utf8' });
      return output.trim();
    } catch (error) {
      throw new Error(`Failed to get latest version for ${packageName}`);
    }
  }

  async updatePackage(name, version, depType) {
    this.log(`⬆️  Updating ${name} to ${version}...`, 'green');
    
    const packageManager = this.detectPackageManager();
    const flag = depType === 'devDependencies' ? '--save-dev' : '--save';
    
    let command;
    if (packageManager === 'pnpm') {
      command = `pnpm add ${flag} ${name}@${version}`;
    } else if (packageManager === 'yarn') {
      command = `yarn add ${flag} ${name}@${version}`;
    } else {
      command = `npm install ${flag} ${name}@${version}`;
    }
    
    execSync(command, { stdio: 'inherit' });
  }

  detectPackageManager() {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';
    return 'npm';
  }

  async verifyUpdates() {
    this.log('🧪 Verifying updates...', 'blue');
    
    const tests = [
      { name: 'Install', command: 'npm ci' },
      { name: 'Build', command: this.config.buildCommand },
      { name: 'Test', command: this.config.testCommand }
    ];
    
    for (const test of tests) {
      try {
        this.log(`🧪 Running ${test.name}...`, 'cyan');
        execSync(test.command, { stdio: 'inherit' });
        this.log(`✅ ${test.name} passed`, 'green');
      } catch (error) {
        this.log(`❌ ${test.name} failed: ${error.message}`, 'red');
        throw new Error(`${test.name} failed`);
      }
    }
  }

  async cleanup() {
    if (fs.existsSync(this.backupDir)) {
      this.log('🧹 Cleaning up temporary files...', 'yellow');
      // Keep backup for a week, then cleanup
      setTimeout(() => {
        fs.rmSync(this.backupDir, { recursive: true, force: true });
      }, 7 * 24 * 60 * 60 * 1000);
    }
  }

  async generateReport() {
    this.log('📄 Generating report...', 'blue');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.updated.length + this.results.skipped.length + this.results.failed.length,
        updated: this.results.updated.length,
        skipped: this.results.skipped.length,
        failed: this.results.failed.length,
        security: this.results.security.length
      },
      details: this.results
    };
    
    const reportPath = path.join(process.cwd(), 'dependency-update-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`📄 Report saved: ${reportPath}`, 'green');
    this.displaySummary();
  }

  displaySummary() {
    this.log('\n📊 UPDATE SUMMARY', 'magenta');
    this.log(`✅ Updated: ${this.results.updated.length}`, 'green');
    this.log(`⏭️  Skipped: ${this.results.skipped.length}`, 'yellow');
    this.log(`❌ Failed: ${this.results.failed.length}`, 'red');
    this.log(`🔒 Security: ${this.results.security.length}`, 'red');
    
    if (this.results.updated.length > 0) {
      this.log('\n⬆️  Updated Packages:', 'green');
      this.results.updated.forEach(pkg => {
        this.log(`  • ${pkg.name}: ${pkg.from} → ${pkg.to} (${pkg.type})`, 'green');
      });
    }
  }

  async rollback() {
    if (!fs.existsSync(this.backupDir)) return;
    
    this.log('🔄 Rolling back changes...', 'red');
    
    try {
      fs.copyFileSync(
        path.join(this.backupDir, 'package.json'),
        path.join(process.cwd(), 'package.json')
      );
      
      const lockFile = this.getLockFile();
      const backupLock = path.join(this.backupDir, path.basename(lockFile));
      
      if (fs.existsSync(backupLock)) {
        fs.copyFileSync(backupLock, lockFile);
      }
      
      this.log('✅ Rollback completed', 'green');
    } catch (error) {
      this.log(`❌ Rollback failed: ${error.message}`, 'red');
    }
  }

  getLockFile() {
    const packageManager = this.detectPackageManager();
    if (packageManager === 'pnpm') return 'pnpm-lock.yaml';
    if (packageManager === 'yarn') return 'yarn.lock';
    return 'package-lock.json';
  }
}

// CLI Interface
if (require.main === module) {
  const updater = new DependencyUpdater();
  updater.run().catch(console.error);
}

module.exports = DependencyUpdater;
