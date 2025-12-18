const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    if (!list) return done(null, results);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const replaceInFile = (filePath) => {
  const ext = path.extname(filePath);
  if (!['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'].includes(ext)) return;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    
    // Replace @app/ with @/
    // Handle both double and single quotes
    let result = data.replace(/from "@app\//g, 'from "@/');
    result = result.replace(/from '@app\//g, "from '@/");
    result = result.replace(/import "@app\//g, 'import "@/');
    result = result.replace(/import '@app\//g, "import '@/");
    
    // SCSS imports (often @use or @import)
    result = result.replace(/@use "@app\//g, '@use "@/');
    result = result.replace(/@use '@app\//g, "@use '@/");
    result = result.replace(/@import "@app\//g, '@import "@/');
    result = result.replace(/@import '@app\//g, "@import '@/");

    if (result !== data) {
      fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log(`Updated: ${filePath}`);
      });
    }
  });
};

const srcDir = path.resolve(__dirname, 'src');
console.log(`Scanning ${srcDir}...`);

walk(srcDir, (err, results) => {
  if (err) throw err;
  results.forEach(replaceInFile);
  console.log('Scan complete.');
});
