/**
 * Dependency Update Automation Configuration
 * Customize update strategies and behavior for your project
 */

module.exports = {
  // Update strategies for different dependency types
  strategies: {
    production: {
      patch: true,        // Auto-update patch versions (bug fixes)
      minor: true,        // Auto-update minor versions (new features, backwards compatible)
      major: false,       // Manual approval required for major versions (breaking changes)
      critical: true      // Always auto-update critical security fixes
    },
    development: {
      patch: true,
      minor: true,
      major: false,       // Major updates often introduce breaking changes in dev tools
      critical: true
    }
  },

  // Packages to ignore during automated updates
  ignore: [
    '@nestjs/core',       // Major version updates require manual review
    'typescript',         // Major TypeScript updates need careful review
    'react',              // Major React updates often require code changes
    'react-dom',          // React DOM updates need synchronization
    '@types/*',           // Type definitions - manual review recommended
    'eslint',             // ESLint updates often change rules
    'jest',               // Jest updates can change test behavior
    'webpack',            // Build tool updates need verification
    'vite',               // Vite updates can affect build process
    'nx',                 // Nx workspace updates need careful testing
    'prisma',             // Database schema changes require review
    // Add custom patterns with wildcards
    '@google-cloud/*',    // Google Cloud services - manual review
    '@aws-sdk/*',         // AWS SDK services - careful updates
    '@tiptap/*',          // Rich text editor - stability important
    'firebase'            // Firebase updates can break functionality
  ],

  // Commands to verify updates
  testCommand: 'npm run test',
  buildCommand: 'npm run build',
  lintCommand: 'npm run lint',

  // Safety settings
  maxRetries: 3,
  backup: true,
  dryRun: false,          // Set to true to simulate updates without applying
  timeout: 300000,        // 5 minutes timeout for commands

  // Update scheduling
  schedule: {
    enabled: false,       // Set to true for automated scheduling
    frequency: 'weekly',  // daily, weekly, monthly
    day: 'monday',        // Day of week for weekly updates
    time: '02:00',        // Time to run updates (24h format)
    timezone: 'UTC'
  },

  // Notification settings
  notifications: {
    enabled: true,
    channels: {
      slack: {
        enabled: false,
        webhook: process.env.SLACK_WEBHOOK_URL || null,
        channel: '#dependencies'
      },
      email: {
        enabled: false,
        to: process.env.NOTIFICATION_EMAIL || null,
        smtp: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        }
      },
      discord: {
        enabled: false,
        webhook: process.env.DISCORD_WEBHOOK_URL || null
      },
      teams: {
        enabled: false,
        webhook: process.env.TEAMS_WEBHOOK_URL || null
      }
    },
    
    // Events to notify about
    events: {
      updateStarted: true,
      updateCompleted: true,
      updateFailed: true,
      securityVulnerability: true,
      rollbackRequired: true,
      manualApprovalRequired: true
    }
  },

  // Security settings
  security: {
    enabled: true,
    autoFix: true,        // Automatically fix security vulnerabilities
    severityThreshold: 'moderate', // low, moderate, high, critical
    auditLevel: 'audit'   // audit, audit-level
  },

  // Branch and PR settings for automated workflows
  git: {
    enabled: false,       // Set to true for automated git operations
    branchPrefix: 'dependency-update',
    commitMessage: 'chore: automated dependency updates',
    autoCreatePR: false,
    autoMerge: false,
    requireApproval: true,
    reviewers: [
      // Add GitHub usernames who should review dependency updates
      // 'maintainer1',
      // 'maintainer2'
    ]
  },

  // Environment-specific settings
  environments: {
    development: {
      strategies: {
        production: { patch: true, minor: true, major: false, critical: true },
        development: { patch: true, minor: true, major: true, critical: true }
      },
      autoUpdate: true,
      testingRequired: false
    },
    staging: {
      strategies: {
        production: { patch: true, minor: true, major: false, critical: true },
        development: { patch: true, minor: true, major: false, critical: true }
      },
      autoUpdate: false,
      testingRequired: true
    },
    production: {
      strategies: {
        production: { patch: true, minor: false, major: false, critical: true },
        development: { patch: true, minor: false, major: false, critical: true }
      },
      autoUpdate: false,
      testingRequired: true,
      approvalRequired: true
    }
  },

  // Logging and reporting
  logging: {
    level: 'info',        // debug, info, warn, error
    file: 'dependency-update.log',
    maxFiles: 5,
    maxSize: '10m',
    format: 'json'        // json, text
  },

  // External service integrations
  integrations: {
    renovate: {
      enabled: false,
      configFile: '.renovaterc.json'
    },
    dependabot: {
      enabled: false,
      schedule: 'weekly'
    },
    snyk: {
      enabled: false,
      apiKey: process.env.SNYK_API_KEY || null
    },
    lighthouse: {
      enabled: false,     // Performance impact monitoring
      budget: {
        performance: 90,
        accessibility: 90,
        bestPractices: 90,
        seo: 90
      }
    }
  },

  // Custom validation rules
  validation: {
    requiredTests: ['unit', 'integration'],
    performanceThreshold: 0.1,      // 10% performance degradation threshold
    bundleSizeThreshold: 0.05,      // 5% bundle size increase threshold
    customChecks: [
      {
        name: 'TypeScript compilation',
        command: 'npx tsc --noEmit',
        required: true
      },
      {
        name: 'Build verification',
        command: 'npm run build',
        required: true
      }
    ]
  },

  // Rollback settings
  rollback: {
    enabled: true,
    autoRollback: false,            // Automatically rollback on failure
    backupRetention: '7d',          // How long to keep backups
    notifyOnRollback: true
  },

  // Metrics and monitoring
  metrics: {
    enabled: true,
    endpoints: {
      prometheus: false,            // Enable Prometheus metrics
      datadog: false,               // Enable Datadog integration
      newrelic: false               // Enable New Relic integration
    }
  }
};
