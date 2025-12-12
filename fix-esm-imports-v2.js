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
    
    // Pattern to match relative imports without .js extensions
    // Matches: from './path/to/file' or from "../path/to/file" (without .js)
    const importPattern = /from\s+['"]([.][^'"]*)['"](?!\s*['"]\.js['"])/g;
    
    let match;
    while ((match = importPattern.exec(content)) !== null) {
      const importPath = match[1];
      // Only fix relative imports that don't already have .js
      if (importPath.startsWith('.') && !importPath.endsWith('.js') && !importPath.endsWith('.ts') && !importPath.endsWith('.tsx')) {
        const newImport = `${match[0].replace(importPath, importPath + '.js')}`;
        content = content.replace(match[0], newImport);
        modified = true;
        console.log(`  Found import: ${match[0]} -> ${newImport}`);
      }
    }
    
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
  console.log('🔧 Fixing ESM import statements...');
  
  const srcDir = path.join(__dirname, 'apps', 'api', 'src');
  const files = findTypeScriptFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed imports in ${fixedCount} files`);
  console.log('🎯 Please rebuild and test the application');
}

if (require.main === module) {
  main();
}

module.exports = { fixImportsInFile, findTypeScriptFiles };
