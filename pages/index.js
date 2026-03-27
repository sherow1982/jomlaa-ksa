import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';

export default function Home({ products, categories }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    if (search) {
      const lowerSearch = search.toLowerCase();
      const filtered = products.filter(p => 
        p.name?.toLowerCase().includes(lowerSearch) || 
        p.description?.toLowerCase().includes(lowerSearch) ||
        p.google_product_category?.toLowerCase().includes(lowerSearch)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setVisibleCount(12);
  }, [search, products]);

  const showMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "متجر جملة السعودية",
    "alternateName": "Jomla KSA Store",
    "url": "https://jomla-ksa.storesads.shop",
    "logo": "https://jomla-ksa.storesads.shop/logo.jpg",
    "description": "متجر إلكتروني سعودي رائد يقدم أفضل المنتجات المنزلية والعناية الشخصية والإلكترونيات بأسعار الجملة وتوصيل سريع لجميع مناطق المملكة العربية السعودية",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "شارع الملك فهد",
      "addressLocality": "الرياض",
      "addressRegion": "منطقة الرياض",
      "postalCode": "11564",
      "addressCountry": "SA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+201110760081",
      "contactType": "customer service",
      "areaServed": "SA",
      "availableLanguage": ["ar", "en"]
    },
    "sameAs": [
      "https://wa.me/201110760081"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "متجر جملة السعودية",
    "url": "https://jomla-ksa.storesads.shop",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://jomla-ksa.storesads.shop/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "الرئيسية",
      "item": "https://jomla-ksa.storesads.shop"
    }]
  };

  return (
    <div className="main-container">
      <Head>
        <title>متجر جملة السعودية | تسوق أونلاين بأسعار الجملة - منتجات منزلية وإلكترونيات</title>
        <meta name="description" content="متجر إلكتروني سعودي رائد يوفر أكثر من 950 منتج منزلي وإلكتروني بأسعار الجملة. شحن مجاني وتوصيل سريع لجميع مناطق المملكة. استرجاع مجاني خلال 14 يوم." />
        <meta name="keywords" content="تسوق أونلاين السعودية, متجر إلكتروني سعودي, منتجات منزلية, إلكترونيات, عناية شخصية, شحن مجاني السعودية, أسعار الجملة" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="متجر جملة السعودية | تسوق أونلاين بأسعار الجملة" />
        <meta property="og:description" content="متجر إلكتروني سعودي رائد يوفر أكثر من 950 منتج بأسعار الجملة وشحن مجاني لجميع مناطق المملكة" />
        <meta property="og:url" content="https://jomla-ksa.storesads.shop" />
        <meta property="og:locale" content="ar_SA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Riyadh" />
        <link rel="canonical" href="https://jomla-ksa.storesads.shop" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <header className="hero-header">
        <h1 className="hero-title">
          <span>متجر</span> جملة السعودية
        </h1>
        <p className="hero-subtitle">الجودة . أسعار الجملة . الثقة</p>
      </header>

      {/* Banner */}
      <div style={{ width: '100%', maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
        <img 
          src="/banner.jpg" 
          alt="عروض متجر عمان" 
          style={{ width: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        />
      </div>

      {/* Categories */}
      <div style={{ width: '100%', maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', textAlign: 'right', borderRight: '4px solid #007A3D', paddingRight: '15px' }}>
          تسوق حسب الفئة
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {categories.map((cat) => (
            <div 
              key={cat}
              onClick={() => router.push(`/category/${encodeURIComponent(cat)}`)}
              style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #007A3D 0%, #005a2d 100%)',
                color: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
      
      <div className="content-wrapper">
        {search && (
          <h2 style={{ marginBottom: '20px', textAlign: 'right', borderRight: '4px solid #007A3D', paddingRight: '10px' }}>
            نتائج البحث عن: "{search}"
          </h2>
        )}
        
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <div 
                key={product.id} 
                onClick={() => router.push(`/product/${product.id}`)} 
                style={{ cursor: 'pointer' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            لا توجد منتجات تطابق بحثك.
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div style={{ textAlign: 'center', marginTop: '50px', marginBottom: '50px' }}>
            <button onClick={showMore} className="load-more-btn">
              عرض المزيد من المنتجات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'jomla-ksa-products.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const allProducts = JSON.parse(jsonData);

  // استخدام الفئة من حقل category
  const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];

  return {
    props: {
      products: allProducts,
      categories,
    },
  };
}


