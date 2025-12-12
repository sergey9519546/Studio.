const fs = require('fs');
const path = require('path');

const DEFAULT_ROOT = path.join(__dirname, 'apps', 'api', 'src');
const DEFAULT_SKIP_DIRS = new Set(['node_modules', 'build', 'dist', '.git']);
const DEFAULT_EXTENSIONS = ['.ts', '.tsx'];

const STATIC_IMPORT_PATTERN = /(from\s+['"])(\.{1,2}[^'"]+)(['"])/g;
const DYNAMIC_IMPORT_PATTERN = /(import\s*\(\s*['"])(\.{1,2}[^'"]+)(['"]\s*\))/g;

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dir: DEFAULT_ROOT,
    appendExt: '.js',
    extensions: [...DEFAULT_EXTENSIONS],
    skipDirs: new Set(DEFAULT_SKIP_DIRS),
    dryRun: false,
    check: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--dir':
      case '-d':
        options.dir = path.resolve(args[++i] || options.dir);
        break;
      case '--append-ext':
      case '-e':
        options.appendExt = normalizeExtension(args[++i], options.appendExt);
        break;
      case '--include':
      case '-i':
        options.extensions = normalizeList(args[++i]).map((ext) =>
          normalizeExtension(ext)
        );
        break;
      case '--skip-dirs':
      case '-s':
        normalizeList(args[++i]).forEach((dir) => options.skipDirs.add(dir));
        break;
      case '--dry-run':
      case '-n':
        options.dryRun = true;
        break;
      case '--check':
        options.dryRun = true;
        options.check = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
      default:
        console.warn(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node fix-esm-imports-v2.js [options]

Options:
  -d, --dir <path>         Root directory to scan (default: apps/api/src)
  -e, --append-ext <ext>   Extension to append (default: .js)
  -i, --include <list>     Comma-separated file extensions to scan (default: .ts,.tsx)
  -s, --skip-dirs <list>   Comma-separated directories to skip (default: node_modules,build,dist,.git)
  -n, --dry-run            Show changes without writing files
      --check              Dry run and exit with code 1 if changes are needed
  -v, --verbose            Show per-file updates
  -h, --help               Show this help text
`);
}

function normalizeExtension(ext, fallback = '.js') {
  if (!ext) {
    return fallback;
  }
  return ext.startsWith('.') ? ext : `.${ext}`;
}

function normalizeList(value) {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function findTargetFiles(dir, options, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (options.skipDirs.has(entry.name)) {
        continue;
      }
      findTargetFiles(path.join(dir, entry.name), options, files);
      continue;
    }

    if (entry.name.endsWith('.d.ts')) {
      continue;
    }

    if (options.extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

function splitSpecifier(specifier) {
  const match = specifier.match(/^([^?#]+)([?#].*)?$/);
  return {
    base: match ? match[1] : specifier,
    suffix: match && match[2] ? match[2] : '',
  };
}

function hasExtension(value) {
  return /\.[a-zA-Z0-9]+$/.test(value);
}

function updateSpecifier(specifier, appendExt) {
  const { base, suffix } = splitSpecifier(specifier);

  if (!base.startsWith('.') || base === '.' || base === '..') {
    return null;
  }

  if (base.endsWith('/')) {
    return null;
  }

  if (hasExtension(base)) {
    return null;
  }

  return `${base}${appendExt}${suffix}`;
}

function rewriteImports(content, appendExt) {
  const updates = [];

  const replaceImport = (match, prefix, specifier, suffix) => {
    const updated = updateSpecifier(specifier, appendExt);
    if (!updated) {
      return match;
    }

    updates.push({ from: specifier, to: updated });
    return `${prefix}${updated}${suffix}`;
  };

  let nextContent = content.replace(STATIC_IMPORT_PATTERN, replaceImport);
  nextContent = nextContent.replace(DYNAMIC_IMPORT_PATTERN, replaceImport);

  return { content: nextContent, updates };
}

function logFileUpdates(filePath, updates, dryRun) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`- ${dryRun ? '[dry-run] ' : ''}${relativePath}`);
  updates.forEach((change) => {
    console.log(`    ${change.from} -> ${change.to}`);
  });
}

function fixImportsInFile(filePath, options) {
  const result = { filePath, updatedImports: 0, changed: false };

  try {
    const original = fs.readFileSync(filePath, 'utf8');
    const { content, updates } = rewriteImports(original, options.appendExt);

    if (!updates.length) {
      return result;
    }

    result.changed = true;
    result.updatedImports = updates.length;

    if (!options.dryRun) {
      fs.writeFileSync(filePath, content, 'utf8');
    }

    if (options.verbose || options.dryRun) {
      logFileUpdates(filePath, updates, options.dryRun);
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to process ${filePath}: ${error.message}`);
  }
}

function main() {
  const options = parseArgs();

  console.log('Fixing ESM import statements...');
  console.log(`Target directory: ${options.dir}`);
  if (options.dryRun) {
    console.log('Running in dry-run mode (no files will be written)');
  }

  if (!fs.existsSync(options.dir)) {
    console.error(`Directory not found: ${options.dir}`);
    process.exit(1);
  }

  const files = findTargetFiles(options.dir, options);
  console.log(`Found ${files.length} file(s) to process`);

  const stats = {
    scanned: files.length,
    modifiedFiles: 0,
    updatedImports: 0,
    errors: [],
  };

  for (const filePath of files) {
    try {
      const result = fixImportsInFile(filePath, options);
      if (result.changed) {
        stats.modifiedFiles += 1;
        stats.updatedImports += result.updatedImports;
      }
    } catch (error) {
      stats.errors.push(error.message);
    }
  }

  console.log(
    `Updated ${stats.updatedImports} import(s) across ${stats.modifiedFiles} file(s)`
  );

  if (stats.errors.length) {
    console.error('Errors encountered:');
    stats.errors.forEach((message) => console.error(`- ${message}`));
  }

  if (options.check && stats.updatedImports > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  fixImportsInFile,
  findTargetFiles,
  rewriteImports,
  updateSpecifier,
};
