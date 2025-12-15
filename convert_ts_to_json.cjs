const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, 'data', 'constants.ts');
const jsonPath = path.join(__dirname, 'updated_app_content.json');

try {
    console.log('Reading:', tsPath);
    let content = fs.readFileSync(tsPath, 'utf8');

    // Find the start of the array
    const startIndex = content.indexOf('[');
    const endIndex = content.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
        throw new Error('Could not find array brackets in constants.ts');
    }

    const jsonString = content.substring(startIndex, endIndex + 1);

    // Verify it's valid JSON
    JSON.parse(jsonString);

    fs.writeFileSync(jsonPath, jsonString);
    console.log(`Successfully created ${jsonPath}`);
} catch (error) {
    console.error('Error converting:', error);
    process.exit(1);
}
