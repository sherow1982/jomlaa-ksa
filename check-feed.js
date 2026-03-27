const fs = require('fs');
const xml = fs.readFileSync('./public/feed.xml', 'utf8');

const itemCount = (xml.match(/<item>/g) || []).length;
const closingCount = (xml.match(/<\/item>/g) || []).length;

console.log('Opening <item> tags:', itemCount);
console.log('Closing </item> tags:', closingCount);
console.log('Has closing </channel>:', xml.includes('</channel>'));
console.log('Has closing </rss>:', xml.includes('</rss>'));
console.log('File size:', xml.length, 'characters');

// Check for empty categories
const emptyCategories = (xml.match(/<g:google_product_category><\/g:google_product_category>/g) || []).length;
console.log('Empty google_product_category tags:', emptyCategories);

// Check for products with sale_price
const salePriceCount = (xml.match(/<g:sale_price>/g) || []).length;
console.log('Products with sale_price:', salePriceCount);
