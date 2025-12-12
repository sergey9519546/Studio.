const fs = require('fs');
const path = require('path');

// Function to find all TypeScript files
function findTypeScriptFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (!['node_modules', 'build', 'dist', '.git'].includes(item)) {
        files.push(...findTypeScriptFiles(fullPath));
      }
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix imports in a file
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern to match relative imports without explicit extensions
    const importPattern = /(from\\s+['"])(\\.{1,2}[^'"]+)(['"])/g;

    content = content.replace(importPattern, (fullMatch, prefix, importPath, suffix) => {
      // Skip if already has an extension
      if (/\\.[a-z0-9]+$/i.test(importPath)) {
        return fullMatch;
      }

      modified = true;
      const updated = `${prefix}${importPath}.js${suffix}`;
      console.log(`  Updated import in ${filePath}: ${importPath} -> ${importPath}.js`);
      return updated;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('Fixing ESM import statements...');
  
  const srcDir = path.join(__dirname, 'apps', 'api', 'src');
  const files = findTypeScriptFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`Fixed imports in ${fixedCount} files`);
  console.log('Please rebuild and test the application');
}

if (require.main === module) {
  main();
}

module.exports = { fixImportsInFile, findTypeScriptFiles };
