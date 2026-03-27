const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'data', 'jomla-ksa-products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const BASE_URL = (process.env.SITE_URL || 'https://jomla-ksa.storesads.shop').trim();
const BASE_PATH = (process.env.BASE_PATH || '').trim();
const FULL_URL = BASE_URL + BASE_PATH;

console.log(`\n🚀 Generating SEO Files for ${FULL_URL}...\n`);

// تصحيح التاريخ إذا كان في المستقبل
let now = new Date();
if (now.getFullYear() > 2025) {
  now = new Date('2025-02-09T08:00:00.000Z');
}
const nowISO = now.toISOString();

// Extract unique categories
const categories = [...new Set(products.map(p => {
  const cat = p.google_product_category || '';
  return cat.split('>').pop()?.trim() || '';
}).filter(Boolean))];

// ============================================
// 1. ROBOTS.TXT
// ============================================
const robotsTxt = `# Robots.txt - Jomla KSA Store
# Generated: ${nowISO}

User-agent: *
Allow: /
Disallow: /_next/
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${FULL_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, 'public', 'robots.txt'), robotsTxt);
console.log('✅ robots.txt created');

// ============================================
// 2. SITEMAP INDEX
// ============================================
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${FULL_URL}/sitemap-main.xml</loc>
    <lastmod>${nowISO}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FULL_URL}/sitemap-products.xml</loc>
    <lastmod>${nowISO}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FULL_URL}/sitemap-categories.xml</loc>
    <lastmod>${nowISO}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapIndex);
console.log('✅ sitemap.xml (index) created');

// ============================================
// 3. SITEMAP MAIN (Static Pages)
// ============================================
const mainPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/shipping', priority: '0.7', changefreq: 'monthly' },
  { url: '/returns', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.6', changefreq: 'yearly' },
  { url: '/cart', priority: '0.9', changefreq: 'always' }
];

const sitemapMain = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages.map(page => `  <url>
    <loc>${FULL_URL}${page.url}</loc>
    <lastmod>${nowISO}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap-main.xml'), sitemapMain);
console.log('✅ sitemap-main.xml created');

// ============================================
// 4. SITEMAP PRODUCTS
// ============================================
const sitemapProducts = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products.map(product => `  <url>
    <loc>${FULL_URL}/product/${product.id}</loc>
    <lastmod>${nowISO}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${product.image}</image:loc>
      <image:title>${(product.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap-products.xml'), sitemapProducts);
console.log('✅ sitemap-products.xml created');

// ============================================
// 5. SITEMAP CATEGORIES
// ============================================
const sitemapCategories = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories.map(cat => `  <url>
    <loc>${FULL_URL}/category/${encodeURIComponent(cat)}</loc>
    <lastmod>${nowISO}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap-categories.xml'), sitemapCategories);
console.log('✅ sitemap-categories.xml created');

// ============================================
// 6. GOOGLE MERCHANT FEED
// ============================================
const escapeXml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

const merchantFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>متجر السعودية - Jomla KSA Store</title>
    <link>${FULL_URL}</link>
    <description>متجر إلكتروني السعوديةي احترافي - شحن مجاني لجميع المنتجات</description>
${products.map(product => {
  const price = parseFloat(product.price || 0);
  const salePrice = parseFloat(product.sale_price || 0);
  const finalPrice = salePrice > 0 && salePrice < price ? salePrice : price;
  
  const title = (product.name || '').substring(0, 150);
  const description = (product.description || '').substring(0, 5000);
  
  const category = escapeXml((product.google_product_category || '').split('>').pop()?.trim() || 'General');
  const googleCategory = escapeXml(product.google_product_category || 'Home &amp; Garden');
  const gallery = product.gallery ? product.gallery.split(',').map(s => s.trim()).slice(0, 10) : [];
  
  return `    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${FULL_URL}/product/${product.id}</g:link>
      <g:image_link>${escapeXml(product.image)}</g:image_link>
${gallery.map(img => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n')}
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${finalPrice.toFixed(3)} SAR</g:price>
${salePrice > 0 && salePrice < price ? `      <g:sale_price>${salePrice.toFixed(3)} SAR</g:sale_price>` : ''}
      <g:brand>Jomla KSA Store</g:brand>
      <g:mpn>${product.id}</g:mpn>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type>${category}</g:product_type>
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>0.000 SAR</g:price>
      </g:shipping>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, 'public', 'feed.xml'), merchantFeed);
console.log('✅ feed.xml (Google Merchant) created');

// ============================================
// 7. SEO REPORT
// ============================================
const seoReport = {
  generated: nowISO,
  site_url: FULL_URL,
  statistics: {
    total_products: products.length,
    total_categories: categories.length,
    total_pages: mainPages.length + products.length + categories.length,
    total_images: products.reduce((sum, p) => {
      const gallery = p.gallery ? p.gallery.split(',').length : 0;
      return sum + 1 + gallery;
    }, 0)
  },
  files_generated: [
    'robots.txt',
    'sitemap.xml',
    'sitemap-main.xml',
    'sitemap-products.xml',
    'sitemap-categories.xml',
    'feed.xml'
  ],
  seo_features: {
    white_background_images: true,
    google_merchant_ready: true,
    structured_data: true,
    meta_tags: true,
    sitemap_index: true,
    robots_txt: true,
    image_sitemap: true,
    mobile_friendly: true,
    fast_loading: true
  },
  urls: {
    sitemap: `${FULL_URL}/sitemap.xml`,
    feed: `${FULL_URL}/feed.xml`,
    robots: `${FULL_URL}/robots.txt`
  }
};

fs.writeFileSync(
  path.join(__dirname, 'public', 'seo-report.json'),
  JSON.stringify(seoReport, null, 2)
);
console.log('✅ seo-report.json created');

// ============================================
// SUMMARY
// ============================================
console.log('\n📊 Summary:');
console.log(`   - ${products.length} products`);
console.log(`   - ${categories.length} categories`);
console.log(`   - ${mainPages.length} static pages`);
console.log(`   - ${seoReport.statistics.total_images} images`);
console.log(`\n🔗 URLs:`);
console.log(`   - Sitemap: ${FULL_URL}/sitemap.xml`);
console.log(`   - Feed: ${FULL_URL}/feed.xml`);
console.log(`   - Robots: ${FULL_URL}/robots.txt`);
console.log(`\n✅ All SEO files generated successfully!\n`);
