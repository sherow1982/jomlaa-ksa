const fs = require('fs');
const path = require('path');

// قراءة بيانات المنتجات
const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/oman-products.json'), 'utf8')
);

// دالة لتنظيف النص من الأحرف الخاصة
function escapeXml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// بناء محتوى XML
let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>متجر عمان - Oman Store</title>
    <link>https://oman.storesads.shop</link>
    <description>متجر إلكتروني عماني احترافي - شحن مجاني لجميع المنتجات</description>
`;

// إضافة المنتجات
productsData.forEach(product => {
  const price = parseFloat(product.price || 0);
  const salePrice = parseFloat(product.sale_price || 0);
  const finalPrice = salePrice > 0 && salePrice < price ? salePrice : price;
  
  // معالجة الصور
  const images = product.gallery ? product.gallery.split(',').map(img => img.trim()) : [product.image];
  const mainImage = images[0] || product.image;
  const additionalImages = images.slice(1, 10); // حد أقصى 10 صور إضافية

  xmlContent += `    <item>
      <g:id>${product.id}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description || '-')}</g:description>
      <g:link>https://oman.storesads.shop/product/${product.id}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
`;

  // إضافة الصور الإضافية
  additionalImages.forEach(img => {
    xmlContent += `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>
`;
  });

  xmlContent += `      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${finalPrice.toFixed(3)} OMR</g:price>
      <g:sale_price>${finalPrice.toFixed(3)} OMR</g:sale_price>
      <g:brand>Oman Store</g:brand>
      <g:mpn>${product.id}</g:mpn>
      <g:google_product_category>${escapeXml(product.google_product_category || 'Hardware > Tools')}</g:google_product_category>
      <g:product_type>${escapeXml(product.google_product_category ? product.google_product_category.split('>').pop().trim() : 'Tools')}</g:product_type>
      <g:shipping>
        <g:country>OM</g:country>
        <g:service>Standard</g:service>
        <g:price>0.000 OMR</g:price>
      </g:shipping>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
`;
});

xmlContent += `  </channel>
</rss>`;

// حفظ الملف في المجلدات المختلفة
const outputDirs = [
  path.join(__dirname, '../public'),
  path.join(__dirname, '../out-github'),
  path.join(__dirname, '../out-cloudflare'),
  path.join(__dirname, '../out-gitlab')
];

outputDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.writeFileSync(path.join(dir, 'feed.xml'), xmlContent, 'utf8');
    console.log(`✅ تم إنشاء feed.xml في: ${dir}`);
  }
});

console.log('✅ تم إنشاء ملف feed.xml بنجاح!');
