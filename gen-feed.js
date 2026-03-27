const fs = require('fs');
const products = JSON.parse(fs.readFileSync('./data/jomla-ksa-products.json', 'utf8'));

const esc = (s) => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>متجر السعودية - Jomla KSA Store</title>
    <link>https://jomla-ksa.storesads.shop</link>
    <description>متجر إلكتروني السعوديةي احترافي - شحن مجاني لجميع المنتجات</description>
`;

products.forEach(p => {
  if (!p.images?.[0]) return;
  xml += `    <item>
      <g:id>${p.id}</g:id>
      <g:title>${esc(p.name)}</g:title>
      <g:description>${esc(p.description)}</g:description>
      <g:link>https://jomla-ksa.storesads.shop/product/${p.id}</g:link>
      <g:image_link>${p.images[0]}</g:image_link>
${p.images.map(i => `      <g:additional_image_link>${i}</g:additional_image_link>`).join('\n')}
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${p.price.toFixed(3)} SAR</g:price>
      <g:sale_price>${p.price.toFixed(3)} SAR</g:sale_price>
      <g:brand>Jomla KSA Store</g:brand>
      <g:mpn>${p.id}</g:mpn>
      <g:google_product_category>${esc(p.googleCategory)}</g:google_product_category>
      <g:product_type>${esc(p.category)}</g:product_type>
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

fs.writeFileSync('./public/feed.xml', xml);
fs.writeFileSync('./out-cloudflare/feed.xml', xml);
console.log(`✅ تم توليد feed.xml - ${products.length} منتج`);
