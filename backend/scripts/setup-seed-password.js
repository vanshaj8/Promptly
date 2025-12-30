const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Generate password hash and update seed.sql
const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }

  const seedPath = path.join(__dirname, '../database/seed.sql');
  let seedContent = fs.readFileSync(seedPath, 'utf8');

  // Replace the placeholder hash with the generated one
  // This assumes the seed file has a placeholder pattern
  const oldHashPattern = /\$2a\$10\$[A-Za-z0-9./]{53}/g;
  seedContent = seedContent.replace(oldHashPattern, hash);

  fs.writeFileSync(seedPath, seedContent);
  console.log(`✅ Updated seed.sql with hash for password: ${password}`);
  console.log(`Hash: ${hash}`);
});

