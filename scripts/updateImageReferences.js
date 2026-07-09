const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// List of all old extensions to look for
const oldExts = ['.jpg', '.jpeg', '.png'];

function processDirectory(directory) {
  let changedFilesCount = 0;
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      changedFilesCount += processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      // Only process text files (JS, TS, TSX, CSS, JSON, etc.)
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.json'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;
        
        // Basic regex to find common static image paths: /images/...
        // This is safer than replacing all .png strings which might match arbitrary text
        // But since we converted ALL images in public/images, we can just replace the extensions
        // of known image paths. Let's do a global replace for all known images in public.
        
        // We know images are mostly in /images/...
        content = content.replace(/(\/images\/[^"'\s]+)\.(png|jpg|jpeg)/gi, '$1.webp');
        // also catch cases where it's just 'images/...'
        content = content.replace(/([^a-zA-Z0-9_\-\/])(images\/[^"'\s]+)\.(png|jpg|jpeg)/gi, '$1$2.webp');

        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          changedFilesCount++;
          console.log(`Updated references in: ${path.relative(srcDir, fullPath)}`);
        }
      }
    }
  }
  return changedFilesCount;
}

console.log('Starting reference update...');
const changed = processDirectory(srcDir);
console.log(`Updated ${changed} files.`);
