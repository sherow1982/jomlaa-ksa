const fs = require('fs');

function escapeXml(text) {
  if (!text) return '';
  // Remove extra newlines and normalize whitespace
  const cleaned = String(text)
    .replace(/\n\s*\n/g, ' ')  // Replace multiple newlines with space
    .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
    .trim();
  
  return cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const products = JSON.parse(fs.readFileSync('./data/jomla-ksa-products.json', 'utf8'));
console.log(`Found ${products.length} products`);

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>متجر السعودية - Jomla KSA Store</title>
    <link>https://jomla-ksa.storesads.shop</link>
    <description>متجر إلكتروني السعوديةي احترافي - شحن مجاني لجميع المنتجات</description>
`;

products.forEach(product => {
  // Parse gallery string to array
  const images = product.gallery ? product.gallery.split(',').map(img => img.trim()) : [];
  if (images.length === 0) return;
  
  xml += `    <item>
      <g:id>${product.id}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>https://jomla-ksa.storesads.shop/product/${product.id}</g:link>
      <g:image_link>${images[0]}</g:image_link>
`;

  images.forEach(img => {
    xml += `      <g:additional_image_link>${img}</g:additional_image_link>
`;
  });

  xml += `      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${product.price.toFixed(3)} SAR</g:price>
      <g:sale_price>${product.price.toFixed(3)} SAR</g:sale_price>
      <g:brand>Jomla KSA Store</g:brand>
      <g:mpn>${product.id}</g:mpn>
      <g:google_product_category>${escapeXml(product.google_product_category || 'Hardware > Tools')}</g:google_product_category>
      <g:product_type>${escapeXml(product.google_product_category || 'Tools')}</g:product_type>
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>0.000 SAR</g:price>
      </g:shipping>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
`;
});

xml += `  </channel>
</rss>`;

fs.writeFileSync('./public/feed.xml', xml, 'utf8');
console.log('✅ Regenerated feed.xml with proper XML escaping');
