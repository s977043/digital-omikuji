const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2];

if (!targetFile) {
    console.error('Usage: node run.js <target_file_path>');
    process.exit(1);
}

const absoluteTargetPath = path.resolve(process.cwd(), targetFile);

if (!fs.existsSync(absoluteTargetPath)) {
    console.error(`Target file not found: ${absoluteTargetPath}`);
    process.exit(1);
}

const parsedPath = path.parse(absoluteTargetPath);
const testsDir = path.join(parsedPath.dir, '__tests__');
const testFilename = `${parsedPath.name}.test${parsedPath.ext}`;
const testFilePath = path.join(testsDir, testFilename);

// Create __tests__ directory
if (!fs.existsSync(testsDir)) {
    console.log(`Creating directory: ${testsDir}`);
    fs.mkdirSync(testsDir, { recursive: true });
}

// Create placeholder test file if it doesn't exist
if (!fs.existsSync(testFilePath)) {
    console.log(`Creating test file: ${testFilePath}`);
    const relativeTargetPath = `../${parsedPath.base}`;
    const content = `import { describe, it, expect } from '@jest/globals';
// import { } from '${relativeTargetPath}';

describe('${parsedPath.name}', () => {
  it('should be implemented', () => {
    expect(true).toBe(true);
  });
});
`;
    fs.writeFileSync(testFilePath, content);
} else {
    console.log(`Test file already exists: ${testFilePath}`);
}

console.log(`\nTest environment ready for: ${targetFile}`);
console.log(`Test file: ${testFilePath}`);
