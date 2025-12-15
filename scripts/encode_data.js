const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data.json');

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    let encodedCount = 0;

    const encodedData = data.map(tool => {
        if (tool.articles) {
            tool.articles = tool.articles.map(article => {
                if (article.content) {
                    // Encode to Base64
                    article.content = Buffer.from(article.content).toString('base64');
                    encodedCount++;
                }
                return article;
            });
        }
        return tool;
    });

    fs.writeFileSync(dataPath, JSON.stringify(encodedData, null, 2));
    console.log(`Successfully encoded ${encodedCount} articles in data.json`);

} catch (err) {
    console.error('Error processing data.json:', err);
    process.exit(1);
}
