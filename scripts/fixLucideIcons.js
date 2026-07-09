const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.tsx', '.jsx'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;

        // Fix Lucide icons that got unoptimized: ImageOff, ImagePlus, ImageIcon
        content = content.replace(/(<(?:ImageOff|ImagePlus|ImageIcon)[^>]+?)\s*unoptimized([^>]*>)/g, '$1$2');

        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Fixed lucide icon in: ${path.relative(srcDir, fullPath)}`);
        }
      }
    }
  }
}

processDirectory(srcDir);
