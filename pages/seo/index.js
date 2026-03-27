import Layout from '../../components/Layout';
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
        <title>دليل التسوق الشامل | متجر عمان</title>
        <meta name="description" content="دليل شامل لجميع المنتجات والفئات في متجر عمان" />
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
                <Link key={page.slug} href={`/seo/${page.slug}`} style={{ 
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
