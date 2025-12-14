#!/usr/bin/env node

/**
 * Dependency Automation Runner
 * Unified interface for all dependency management tasks
 */

const { spawn } = require('child_process');
const path = require('path');

class DependencyAutomationRunner {
  constructor() {
    this.scripts = {
      'update': 'dependency-updater.js',
      'health': 'dependency-health-monitor.js',
      'check': 'npm outdated',
      'audit': 'npm audit',
      'fix': 'npm audit fix'
    };
  }

  async run(command, args = []) {
    console.log(`🚀 Running dependency automation: ${command}`);
    
    switch (command) {
      case 'update':
        return this.runUpdater(args);
      case 'health':
        return this.runHealthCheck(args);
      case 'check':
        return this.runCommand('npm', ['outdated']);
      case 'audit':
        return this.runCommand('npm', ['audit']);
      case 'fix':
        return this.runCommand('npm', ['audit', 'fix']);
      case 'full':
        return this.runFullCheck();
      case 'safe-update':
        return this.runSafeUpdate();
      default:
        this.showHelp();
        break;
    }
  }

  async runUpdater(args) {
    const scriptPath = path.join(__dirname, this.scripts.update);
    return this.runNodeScript(scriptPath, args);
  }

  async runHealthCheck(args) {
    const scriptPath = path.join(__dirname, this.scripts.health);
    return this.runNodeScript(scriptPath, args);
  }

  async runFullCheck() {
    console.log('🔍 Running full dependency check...\n');
    
    // Run health check
    await this.runHealthCheck();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Run security audit
    await this.runCommand('npm', ['audit']);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check for outdated packages
    await this.runCommand('npm', ['outdated']);
    
    console.log('\n✅ Full dependency check completed!');
  }

  async runSafeUpdate() {
    console.log('🔒 Running safe dependency update...\n');
    
    // First, run health check
    await this.runHealthCheck();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Run security audit first
    console.log('🔒 Running security audit...');
    await this.runCommand('npm', ['audit', '--audit-level=moderate']);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Apply security fixes
    console.log('🔧 Applying security fixes...');
    await this.runCommand('npm', ['audit', 'fix']);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Run dependency updater
    await this.runUpdater(['--safe']);
    
    console.log('\n✅ Safe update completed!');
  }

  runNodeScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
      const process = spawn('node', [scriptPath, ...args], {
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Script exited with code ${code}`));
        }
      });

      process.on('error', reject);
    });
  }

  runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0 || code === 1) { // npm outdated returns 1 when outdated packages exist
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      process.on('error', reject);
    });
  }

  showHelp() {
    console.log(`
📦 Dependency Automation Runner

Usage: node scripts/run-dependency-automation.js <command> [options]

Commands:
  update         Run full dependency updater with safety checks
  health         Run comprehensive dependency health check
  check          Check for outdated packages
  audit          Run security audit
  fix            Apply security fixes
  full           Run complete dependency analysis (health + audit + outdated)
  safe-update    Run safe update process (health + audit fix + safe updates)

Examples:
  node scripts/run-dependency-automation.js health
  node scripts/run-dependency-automation.js update
  node scripts/run-dependency-automation.js safe-update
  node scripts/run-dependency-automation.js full

For more detailed information, see DEPENDENCY_AUTOMATION_DOCUMENTATION.md
`);
  }
}

// CLI Interface
if (require.main === module) {
  const runner = new DependencyAutomationRunner();
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  if (!command) {
    runner.showHelp();
    process.exit(0);
  }
  
  runner.run(command, args).catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = DependencyAutomationRunner;
