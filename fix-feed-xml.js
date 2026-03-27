const fs = require('fs');

// Read the feed.xml file
const feedPath = './public/feed.xml';
let content = fs.readFileSync(feedPath, 'utf8');

// Fix unescaped ampersands in descriptions and other text content
// This regex finds & that are not already part of an entity (&amp; &lt; &gt; &quot; &apos;)
content = content.replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;');

// Write the fixed content back
fs.writeFileSync(feedPath, content, 'utf8');

console.log('✅ Fixed feed.xml - escaped all ampersands');
