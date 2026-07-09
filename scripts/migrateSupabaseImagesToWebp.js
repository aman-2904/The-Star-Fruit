require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function processBucket(bucketName) {
  console.log(`Processing bucket: ${bucketName}`);
  const { data: files, error } = await supabase.storage.from(bucketName).list('', { limit: 1000 });
  
  if (error) {
    console.error(`Error listing files in ${bucketName}:`, error);
    return;
  }

  const imagesToConvert = files.filter(f => f.name.match(/\.(jpg|jpeg|png)$/i));
  console.log(`Found ${imagesToConvert.length} images to convert in ${bucketName}`);

  for (const file of imagesToConvert) {
    const ext = file.name.split('.').pop();
    const newName = file.name.replace(new RegExp(`\\.${ext}$`, 'i'), '.webp');

    console.log(`Converting ${file.name} to ${newName}...`);

    // Download file
    const { data: fileData, error: downloadError } = await supabase.storage.from(bucketName).download(file.name);
    if (downloadError) {
      console.error(`Failed to download ${file.name}:`, downloadError);
      continue;
    }

    // Convert using Sharp
    const buffer = Buffer.from(await fileData.arrayBuffer());
    try {
      const webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

      // Upload converted file
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(newName, webpBuffer, {
        contentType: 'image/webp',
        upsert: false
      });

      if (uploadError) {
        console.error(`Failed to upload ${newName}:`, uploadError);
        continue;
      }

      console.log(`Uploaded ${newName} successfully. Deleting old file...`);
      // Delete old file
      await supabase.storage.from(bucketName).remove([file.name]);

    } catch (err) {
      console.error(`Failed to convert ${file.name}:`, err);
    }
  }
}

async function updateDatabaseRecords() {
  console.log('Updating database records for properties...');
  // Fetch all properties that have images
  const { data: properties, error } = await supabase.from('properties').select('id, images');
  
  if (error) {
    console.error('Error fetching properties:', error);
    return;
  }

  for (const property of properties) {
    if (!property.images || property.images.length === 0) continue;
    
    let hasChanges = false;
    const newImages = property.images.map(url => {
      if (url.match(/\.(jpg|jpeg|png)$/i)) {
        hasChanges = true;
        return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
      return url;
    });

    if (hasChanges) {
      console.log(`Updating property ${property.id}...`);
      const { error: updateError } = await supabase.from('properties').update({ images: newImages }).eq('id', property.id);
      if (updateError) {
        console.error(`Error updating property ${property.id}:`, updateError);
      }
    }
  }
  
  console.log('Updating database records for blogs (if applicable)...');
  const { data: blogs, error: blogError } = await supabase.from('blogs').select('id, cover_image, content');
  if (blogError && blogError.code !== 'PGRST116' && blogError.code !== '42P01') {
    console.error('Error fetching blogs:', blogError);
  } else if (blogs) {
    for (const blog of blogs) {
      const updates = {};
      
      if (blog.cover_image && blog.cover_image.match(/\.(jpg|jpeg|png)$/i)) {
        updates.cover_image = blog.cover_image.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
      
      if (blog.content) {
        const newContent = blog.content.replace(/(\.(jpg|jpeg|png))/gi, '.webp');
        if (newContent !== blog.content) {
          updates.content = newContent;
        }
      }

      if (Object.keys(updates).length > 0) {
        console.log(`Updating blog ${blog.id}...`);
        await supabase.from('blogs').update(updates).eq('id', blog.id);
      }
    }
  }
}

async function run() {
  await processBucket('property-images');
  await processBucket('blog-images');
  await updateDatabaseRecords();
  console.log('Migration completed.');
}

run();
