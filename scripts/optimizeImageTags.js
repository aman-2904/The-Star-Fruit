const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const criticalFiles = ['Navbar.tsx', 'Hero.tsx'];

let filesModified = 0;

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

        // Skip adding unoptimized to critical files entirely
        if (!criticalFiles.includes(path.basename(fullPath))) {
          // We look for <Image ... />
          // Note: This regex finds the <Image tag and its body until />
          // We will use replace with a function to parse each <Image /> tag.
          content = content.replace(/<Image([^>]+)\/>/g, (match, attrs) => {
            let newAttrs = attrs;

            // If it doesn't have unoptimized, add it
            if (!/\bunoptimized\b/.test(newAttrs)) {
              newAttrs += ' unoptimized';
            }

            // Remove priority from non-critical files except if it's explicitly conditional like priority={i === 0}
            // Actually, to be safe, if we are marking it unoptimized, we can keep priority if they want it fetched early, 
            // but Vercel limits are about Transformations, which is solved by `unoptimized`. 
            // However, the requirement says "Remove priority from non-critical images" (actually it says "Enable lazy loading for all non-critical images").
            // Next.js Image lazy loads by default UNLESS priority is set.
            // Let's remove `priority` and `priority={true}`. We'll leave `priority={...}` if it's complex, or just remove `priority` literally.
            newAttrs = newAttrs.replace(/\s+priority(?:\s|={true})?/g, ' ');

            return `<Image${newAttrs}/>`;
          });
          
          // Also handle multiline <Image ... > ... </Image> if any (Next.js Image is usually self-closing)
        }

        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          filesModified++;
          console.log(`Updated Image tags in: ${path.relative(srcDir, fullPath)}`);
        }
      }
    }
  }
}

console.log('Starting Image tag optimization...');
processDirectory(srcDir);
console.log(`Finished! Modified ${filesModified} files.`);
