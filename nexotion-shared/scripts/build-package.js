const { copyFileSync } = require('fs');
const path = require('path');

try {
  copyFileSync(
    path.resolve(__dirname, '../package.json'), 
    path.resolve(__dirname, '../build/package.json')
  );
  console.log('package.json copied successfully');
} catch (error) {
  console.error('Failed to copy package.json:', error);
  process.exit(1);
}