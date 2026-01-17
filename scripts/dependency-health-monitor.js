#!/usr/bin/env node

/**
 * Dependency Health Monitoring System
 * Monitors dependency health, aging, and maintenance status
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

class DependencyHealthMonitor {
  constructor() {
    this.healthData = {
      outdated: [],
      vulnerable: [],
      deprecated: [],
      unmaintained: [],
      healthy: [],
      summary: {}
    };
  }

  async run() {
    console.log('🏥 Starting Dependency Health Monitor...');

    try {
      await this.checkOutdatedPackages();
      await this.checkVulnerabilities();
      await this.checkDeprecatedPackages();
      await this.checkMaintenanceStatus();
      await this.generateHealthReport();

      console.log('✅ Health monitoring completed!');
    } catch (error) {
      console.error('❌ Health monitoring failed:', error.message);
      throw error;
    }
  }

  async checkOutdatedPackages() {
    console.log('📅 Checking for outdated packages...');

    try {
      const output = execSync('npm outdated --json', { encoding: 'utf8' });
      const outdated = JSON.parse(output);

      Object.entries(outdated).forEach(([name, info]) => {
        this.healthData.outdated.push({
          name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          type: info.type
        });
      });

      console.log(`📊 Found ${this.healthData.outdated.length} outdated packages`);
    } catch (error) {
      if (error.status !== 0) {
        console.log('✅ All packages are up to date');
      } else {
        throw error;
      }
    }
  }

  async checkVulnerabilities() {
    console.log('🔒 Checking for security vulnerabilities...');

    try {
      const output = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(output);

      if (audit.vulnerabilities) {
        Object.entries(audit.vulnerabilities).forEach(([name, vuln]) => {
          this.healthData.vulnerable.push({
            name,
            severity: vuln.severity,
            title: vuln.title,
            url: vuln.url,
            fixAvailable: !!vuln.fixAvailable
          });
        });
      }

      console.log(`🚨 Found ${this.healthData.vulnerable.length} vulnerable packages`);
    } catch (error) {
      console.log('✅ No vulnerabilities found');
    }
  }

  async checkDeprecatedPackages() {
    console.log('⚠️  Checking for deprecated packages...');

    const packageManager = this.detectPackageManager();
    let dependencies = {};

    try {
      if (packageManager === 'pnpm') {
        const output = execSync('pnpm list --json', { encoding: 'utf8' });
        const data = JSON.parse(output);
        dependencies = { ...data.dependencies, ...data.devDependencies };
      } else if (packageManager === 'yarn') {
        const output = execSync('yarn list --json', { encoding: 'utf8' });
        const data = JSON.parse(output);
        dependencies = this.parseYarnList(data);
      } else {
        const output = execSync('npm list --json', { encoding: 'utf8' });
        dependencies = { ...output.dependencies, ...output.devDependencies };
      }

      for (const [name, version] of Object.entries(dependencies)) {
        if (name.startsWith('@types/')) continue; // Skip type definitions

        const deprecationInfo = await this.checkDeprecation(name);
        if (deprecationInfo) {
          this.healthData.deprecated.push({
            name,
            version,
            deprecated: true,
            ...deprecationInfo
          });
        }
      }

      console.log(`⚠️  Found ${this.healthData.deprecated.length} deprecated packages`);
    } catch (error) {
      console.log('⚠️  Could not check deprecation status:', error.message);
    }
  }

  async checkMaintenanceStatus() {
    console.log('🔍 Checking maintenance status...');

    const dependencies = this.getAllDependencies();

    for (const name of dependencies.slice(0, 50)) { // Limit to 50 packages to avoid rate limits
      if (name.startsWith('@types/')) continue;

      try {
        const maintenanceInfo = await this.checkPackageMaintenance(name);
        if (maintenanceInfo.isUnmaintained || maintenanceInfo.isOld) {
          this.healthData.unmaintained.push({
            name,
            ...maintenanceInfo
          });
        } else {
          this.healthData.healthy.push({
            name,
            ...maintenanceInfo
          });
        }
      } catch (error) {
        console.log(`⚠️  Could not check ${name}:`, error.message);
      }
    }

    console.log(`📊 Checked ${this.healthData.healthy.length + this.healthData.unmaintained.length} packages`);
  }

  async checkDeprecation(packageName) {
    return new Promise((resolve) => {
      const url = `https://registry.npmjs.org/${packageName}`;

      https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const info = JSON.parse(data);
            if (info.deprecated) {
              resolve({
                reason: info.deprecated,
                replacement: info.versions[info['dist-tags']?.latest]?.deprecated
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            resolve(null);
          }
        });
      }).on('error', () => {
        resolve(null);
      });
    });
  }

  async checkPackageMaintenance(packageName) {
    return new Promise((resolve) => {
      const url = `https://registry.npmjs.org/${packageName}`;

      https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const info = JSON.parse(data);
            const latest = info['dist-tags']?.latest;
            const latestInfo = info.versions?.[latest];
            const timeOfLatest = info.time?.[latest];

            const isOld = this.isPackageOld(timeOfLatest);
            const isUnmaintained = this.isUnmaintained(info);

            resolve({
              isOld,
              isUnmaintained,
              latestVersion: latest,
              lastUpdate: timeOfLatest,
              maintainers: info.maintainers?.length || 0,
              repository: info.repository?.url || null,
              homepage: info.homepage || null
            });
          } catch (error) {
            resolve({
              isOld: false,
              isUnmaintained: false,
              error: error.message
            });
          }
        });
      }).on('error', () => {
        resolve({
          isOld: false,
          isUnmaintained: false,
          error: 'Network error'
        });
      });
    });
  }

  isPackageOld(lastUpdate) {
    if (!lastUpdate) return false;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return new Date(lastUpdate) < oneYearAgo;
  }

  isUnmaintained(packageInfo) {
    // Consider unmaintained if no maintainers or no recent activity
    return (!packageInfo.maintainers || packageInfo.maintainers.length === 0);
  }

  getAllDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      return Object.keys(deps);
    } catch (error) {
      return [];
    }
  }

  parseYarnList(data) {
    const dependencies = {};
    // Parse yarn list JSON format
    // This is a simplified parser - you might need to adjust based on your yarn version
    return dependencies;
  }

  detectPackageManager() {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';
    return 'npm';
  }

  async generateHealthReport() {
    console.log('📄 Generating health report...');

    this.calculateSummary();

    const report = {
      timestamp: new Date().toISOString(),
      summary: this.healthData.summary,
      details: this.healthData
    };

    const reportPath = path.join(process.cwd(), 'dependency-health-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Health report saved: ${reportPath}`);
    this.displaySummary();
  }

  calculateSummary() {
    this.healthData.summary = {
      total: this.healthData.outdated.length +
             this.healthData.vulnerable.length +
             this.healthData.deprecated.length +
             this.healthData.unmaintained.length +
             this.healthData.healthy.length,
      outdated: this.healthData.outdated.length,
      vulnerable: this.healthData.vulnerable.length,
      deprecated: this.healthData.deprecated.length,
      unmaintained: this.healthData.unmaintained.length,
      healthy: this.healthData.healthy.length,
      healthScore: this.calculateHealthScore()
    };
  }

  calculateHealthScore() {
    const total = this.healthData.summary.total;
    if (total === 0) return 100;

    const issues = this.healthData.vulnerable.length +
                   this.healthData.deprecated.length +
                   this.healthData.unmaintained.length;

    const outdatedRatio = this.healthData.outdated.length / total;
    const issuesRatio = issues / total;

    let score = 100;
    score -= issuesRatio * 50;     // Heavy penalty for vulnerabilities/deprecations
    score -= outdatedRatio * 30;   // Penalty for outdated packages

    return Math.max(0, Math.round(score));
  }

  displaySummary() {
    console.log('\n🏥 DEPENDENCY HEALTH SUMMARY');
    console.log(`📊 Total packages checked: ${this.healthData.summary.total}`);
    console.log(`✅ Healthy: ${this.healthData.summary.healthy}`);
    console.log(`⚠️  Outdated: ${this.healthData.summary.outdated}`);
    console.log(`🔒 Vulnerable: ${this.healthData.summary.vulnerable}`);
    console.log(`🚫 Deprecated: ${this.healthData.summary.deprecated}`);
    console.log(`⏳ Unmaintained: ${this.healthData.summary.unmaintained}`);
    console.log(`💚 Health Score: ${this.healthData.summary.healthScore}/100`);

    if (this.healthData.summary.healthScore < 70) {
      console.log('⚠️  Health Score is below 70 - Action recommended!');
    }
  }
}

// CLI Interface
if (require.main === module) {
  const monitor = new DependencyHealthMonitor();
  monitor.run().catch(console.error);
}

module.exports = DependencyHealthMonitor;
