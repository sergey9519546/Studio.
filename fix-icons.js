const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const nodeModulesDir = path.join(rootDir, 'node_modules');

const constantsContent = `export var sizes = {
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px'
};
export var sizeMap = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge'
};
export var dimensions = {
  small: {
    width: sizes.small,
    height: sizes.small
  },
  medium: {
    width: sizes.medium,
    height: sizes.medium
  },
  large: {
    width: sizes.large,
    height: sizes.large
  },
  xlarge: {
    width: sizes.xlarge,
    height: sizes.xlarge
  }
};
`;

function traverse(dir) {
    if (!fs.existsSync(dir)) return;
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return;
    }

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith('.')) continue; // skip .bin, .cache

        const fullPath = path.join(dir, entry.name);
        
        // Check if this directory identifies as @atlaskit/icon
        // (path ends with @atlaskit/icon or @atlaskit\icon)
        if (fullPath.endsWith(path.join('@atlaskit', 'icon'))) {
             const constantsPath = path.join(fullPath, 'dist', 'esm', 'constants.js');
             const esmDir = path.join(fullPath, 'dist', 'esm');
             if (fs.existsSync(esmDir)) {
                 if (!fs.existsSync(constantsPath)) {
                     console.log(`Fixing missing constants.js in: ${fullPath}`);
                     fs.writeFileSync(constantsPath, constantsContent);
                 } else {
                     // check content size, if empty overwrite? nah
                 }
             }
        }
        
        // Check for nested node_modules
        const nestedNm = path.join(fullPath, 'node_modules');
        if (fs.existsSync(nestedNm)) {
            traverse(nestedNm);
        }
        
        // If we are in a scope dir like @atlaskit, recurse immediate children
        if (entry.name.startsWith('@')) {
            traverse(fullPath);
        }
    }
}

console.log('Starting scan of node_modules...');
traverse(nodeModulesDir);
console.log('Scan complete.');
