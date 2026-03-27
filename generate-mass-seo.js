const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'jomla-ksa-products.json'), 'utf8'));
const BASE_URL = 'https://jomla-ksa.storesads.shop';

console.log('\n🚀 Generating Mass-SEO Pages...\n');

// استخراج الكلمات المفتاحية
const keywords = [
  'شراء', 'سعر', 'عروض', 'تخفيضات', 'أفضل', 'رخيص', 'جودة عالية',
  'توصيل مجاني', 'شحن سريع', 'متجر', 'أونلاين', 'السعودية', 'الرياض'
];

const categories = [...new Set(products.map(p => {
  const cat = p.google_product_category || '';
  return cat.split('>').pop()?.trim() || '';
}).filter(Boolean))];

const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Xiaomi', 'Huawei', 'Oppo'];
const priceRanges = [
  { name: 'رخيص', min: 0, max: 20 },
  { name: 'متوسط', min: 20, max: 50 },
  { name: 'فاخر', min: 50, max: 1000 }
];

let seoPages = [];

// 1. صفحات الفئات + كلمات مفتاحية
categories.forEach(cat => {
  keywords.forEach(kw => {
    const slug = `${kw}-${cat}`.replace(/\s+/g, '-').toLowerCase();
    const products_in_cat = products.filter(p => 
      p.google_product_category?.includes(cat)
    ).slice(0, 20);
    
    if (products_in_cat.length > 0) {
      seoPages.push({
        slug,
        title: `${kw} ${cat} في السعودية | متجر السعودية`,
        description: `${kw} ${cat} بأفضل الأسعار في سلطنة السعودية. شحن مجاني وتوصيل سريع. ${products_in_cat.length} منتج متوفر.`,
        keywords: `${kw}, ${cat}, السعودية, الرياض, شحن مجاني`,
        products: products_in_cat,
        type: 'category-keyword'
      });
    }
  });
});

// 2. صفحات نطاقات الأسعار
priceRanges.forEach(range => {
  categories.forEach(cat => {
    const slug = `${cat}-${range.name}`.replace(/\s+/g, '-').toLowerCase();
    const products_in_range = products.filter(p => {
      const price = parseFloat(p.sale_price || p.price || 0);
      return price >= range.min && price <= range.max && 
             p.google_product_category?.includes(cat);
    }).slice(0, 20);
    
    if (products_in_range.length > 0) {
      seoPages.push({
        slug,
        title: `${cat} ${range.name} السعر | من ${range.min} إلى ${range.max} ريال`,
        description: `تسوق ${cat} بأسعار ${range.name}ة من ${range.min} إلى ${range.max} ريال السعوديةي. ${products_in_range.length} منتج متاح.`,
        keywords: `${cat}, ${range.name}, أسعار, السعودية`,
        products: products_in_range,
        type: 'price-range'
      });
    }
  });
});

// 3. صفحات العلامات التجارية
brands.forEach(brand => {
  const products_by_brand = products.filter(p => 
    p.name?.includes(brand) || p.description?.includes(brand)
  ).slice(0, 20);
  
  if (products_by_brand.length > 0) {
    seoPages.push({
      slug: `${brand.toLowerCase()}-products`,
      title: `منتجات ${brand} في السعودية | أفضل الأسعار`,
      description: `تسوق منتجات ${brand} الأصلية في سلطنة السعودية. ${products_by_brand.length} منتج متوفر مع شحن مجاني.`,
      keywords: `${brand}, منتجات ${brand}, السعودية`,
      products: products_by_brand,
      type: 'brand'
    });
  }
});

// 4. صفحات "أفضل 10"
categories.forEach(cat => {
  const top_products = products
    .filter(p => p.google_product_category?.includes(cat))
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    .slice(0, 10);
  
  if (top_products.length >= 5) {
    seoPages.push({
      slug: `best-${cat.replace(/\s+/g, '-').toLowerCase()}`,
      title: `أفضل 10 ${cat} في السعودية 2024 | تقييمات حقيقية`,
      description: `اكتشف أفضل ${cat} في سلطنة السعودية بناءً على تقييمات العملاء. مقارنة شاملة وأسعار تنافسية.`,
      keywords: `أفضل ${cat}, تقييمات, السعودية, 2024`,
      products: top_products,
      type: 'top-10'
    });
  }
});

// 5. صفحات المقارنات
categories.forEach(cat => {
  const compare_products = products
    .filter(p => p.google_product_category?.includes(cat))
    .slice(0, 5);
  
  if (compare_products.length >= 3) {
    seoPages.push({
      slug: `compare-${cat.replace(/\s+/g, '-').toLowerCase()}`,
      title: `مقارنة ${cat} | أيهما أفضل؟`,
      description: `مقارنة شاملة بين أفضل ${cat} في السعودية. السعر، المواصفات، والتقييمات.`,
      keywords: `مقارنة ${cat}, أيهما أفضل, السعودية`,
      products: compare_products,
      type: 'comparison'
    });
  }
});

console.log(`✅ Generated ${seoPages.length} SEO pages\n`);

// إنشاء مجلد mass-seo
const massDir = path.join(__dirname, 'pages', 'seo');
if (!fs.existsSync(massDir)) {
  fs.mkdirSync(massDir, { recursive: true });
}

// إنشاء صفحة ديناميكية [slug].js
const dynamicPage = `import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import Head from 'next/head';
import seoData from '../../data/mass-seo.json';

export default function SEOPage({ page }) {
  const router = useRouter();
  
  if (!page) {
    return <Layout><div style={{padding:'40px',textAlign:'center'}}>الصفحة غير موجودة</div></Layout>;
  }

  return (
    <Layout>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
        <link rel="canonical" href={\`https://jomla-ksa.storesads.shop/seo/\${page.slug}\`} />
      </Head>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#333' }}>{page.title}</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>{page.description}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {page.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: seoData.map(page => ({ params: { slug: page.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const page = seoData.find(p => p.slug === params.slug);
  return { props: { page: page || null } };
}
`;

fs.writeFileSync(path.join(massDir, '[slug].js'), dynamicPage);
console.log('✅ Created dynamic SEO page: pages/seo/[slug].js');

// حفظ بيانات SEO
fs.writeFileSync(
  path.join(__dirname, 'data', 'mass-seo.json'),
  JSON.stringify(seoPages, null, 2)
);
console.log('✅ Saved SEO data: data/mass-seo.json');

// إنشاء sitemap للـ mass-seo
const now = new Date().toISOString();
const seoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seoPages.map(page => `  <url>
    <loc>${BASE_URL}/seo/${page.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap-seo.xml'), seoSitemap);
console.log('✅ Created sitemap: public/sitemap-seo.xml');

// تحديث sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-products.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-categories.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-seo.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapIndex);
console.log('✅ Updated sitemap index');

// إنشاء صفحة فهرس SEO
const indexPage = `import Layout from '../../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
import seoData from '../../data/mass-seo.json';

export default function SEOIndex() {
  const groupedPages = seoData.reduce((acc, page) => {
    if (!acc[page.type]) acc[page.type] = [];
    acc[page.type].push(page);
    return acc;
  }, {});

  const typeNames = {
    'category-keyword': 'الفئات والكلمات المفتاحية',
    'price-range': 'نطاقات الأسعار',
    'brand': 'العلامات التجارية',
    'top-10': 'أفضل 10 منتجات',
    'comparison': 'المقارنات'
  };

  return (
    <Layout>
      <Head>
        <title>دليل التسوق الشامل | متجر السعودية</title>
        <meta name="description" content="دليل شامل لجميع المنتجات والفئات في متجر السعودية" />
      </Head>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>
          🔍 دليل التسوق الشامل
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          {seoData.length} صفحة لمساعدتك في العثور على ما تبحث عنه
        </p>

        {Object.entries(groupedPages).map(([type, pages]) => (
          <div key={type} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#007A3D' }}>
              {typeNames[type] || type}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
              {pages.map(page => (
                <Link key={page.slug} href={\`/seo/\${page.slug}\`} style={{ 
                  padding: '15px', 
                  background: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  textDecoration: 'none',
                  color: '#333',
                  transition: 'all 0.3s'
                }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#007A3D' }}>
                    {page.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                    {page.products.length} منتج
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
`;

fs.writeFileSync(path.join(massDir, 'index.js'), indexPage);
console.log('✅ Created SEO index page: pages/seo/index.js');

console.log(`\n📊 Summary:`);
console.log(`   - ${seoPages.length} SEO pages created`);
console.log(`   - Sitemap: ${BASE_URL}/sitemap-seo.xml`);
console.log(`   - Index: ${BASE_URL}/seo/`);
console.log(`\n✅ Mass-SEO completed!\n`);
