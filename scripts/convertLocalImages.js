const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
let totalOriginalSize = 0;
let totalNewSize = 0;
let convertedCount = 0;

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const newPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
        
        // Track original size
        totalOriginalSize += stat.size;

        try {
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(newPath);
            
          const newStat = fs.statSync(newPath);
          totalNewSize += newStat.size;
          convertedCount++;
          
          // Delete old file
          fs.unlinkSync(fullPath);
          console.log(`Converted: ${path.relative(publicDir, fullPath)} -> ${path.relative(publicDir, newPath)}`);
        } catch (err) {
          console.error(`Failed to convert ${fullPath}:`, err);
        }
      }
    }
  }
}

async function run() {
  console.log('Starting image conversion...');
  await processDirectory(publicDir);
  
  console.log('\n--- Conversion Report ---');
  console.log(`Images Converted: ${convertedCount}`);
  console.log(`Original Total Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New Total Size: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
  const saved = totalOriginalSize - totalNewSize;
  const savedPercent = totalOriginalSize > 0 ? (saved / totalOriginalSize * 100).toFixed(2) : 0;
  console.log(`Storage Saved: ${(saved / 1024 / 1024).toFixed(2)} MB (${savedPercent}%)`);
}

run();
