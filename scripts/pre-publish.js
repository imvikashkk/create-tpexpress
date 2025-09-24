import fs from 'fs';
import path from 'path';

// List of all database template directories
const template = ['drizzle', 'mongoose', 'prisma', 'postgres'];

// Files to rename
const filesToRename = [
  { original: '.env', temp: 'env.template' },
  { original: '.gitignore', temp: 'gitignore.template' },
];

// Iterate through each database template folder
template.forEach((templateDir) => {
  const templatePath = path.join(
    import.meta.dirname,
    '..',
    'templates',
    templateDir
  );

  // Iterate through each file that needs to be renamed
  filesToRename.forEach(({ original, temp }) => {
    const originalPath = path.join(templatePath, original);
    const tempPath = path.join(templatePath, temp);

    // Check if the original file exists before attempting to rename it
    if (fs.existsSync(originalPath)) {
      try {
        fs.renameSync(originalPath, tempPath);
        // console.log(
        //   `✅ Renamed ${original} → ${temp} inside /templates/${templateDir}`
        // );
      } catch (error) {
        console.error(`❌ Failed to rename ${originalPath}: ${error.message}`);
      }
    } else {
      console.log(
        `⚠️  ${original} not found in /templates/${templateDir}, skipping.`
      );
    }
  });
});

console.log('✨ All template files have been processed.');
