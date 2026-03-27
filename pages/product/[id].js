import { useState } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { useCart } from '../../context/CartContext';
import FloatingButtons from '../../components/FloatingButtons';
import ProductImage from '../../components/ProductImage';

const normalizeProduct = (product) => {
  if (!product) return null;
  
  const images = product.images || [];
  const mainImage = images[0] || product.image || '';
  const gallery = images.slice(1);
  
  return {
    ...product,
    title: product.name || '',
    mainImage,
    gallery,
    price: parseFloat(product.regular_price || product.price || 0),
    salePrice: parseFloat(product.sale_price || product.price || 0),
    category: product.category || '',
    availability: product.availability || 'in stock',
    availabilityAr: product.availability_ar || 'متوفر'
  };
};

export default function ProductDetails({ product: rawProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const product = normalizeProduct(rawProduct);
  const [mainImage, setMainImage] = useState(product?.mainImage || '');

  if (router.isFallback) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>جاري التحميل...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>المنتج غير موجود</div>;
  }

  const price = product.price;
  const salePrice = product.salePrice;
  const finalPrice = salePrice > 0 && salePrice < price ? salePrice : price;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [product.mainImage, ...(product.gallery || [])].filter(Boolean),
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "متجر جملة السعودية"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://jomla-ksa.storesads.shop/product/${product.id}`,
      "priceCurrency": "SAR",
      "price": finalPrice.toFixed(2),
      "priceValidUntil": new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      "availability": product.availability === 'in stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "متجر جملة السعودية"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "SAR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "SA"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://jomla-ksa.storesads.shop"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category || "منتجات",
        "item": `https://jomla-ksa.storesads.shop/category/${encodeURIComponent(product.category)}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://jomla-ksa.storesads.shop/product/${product.id}`
      }
    ]
  };

  return (
    <div className="product-page-container" style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <Head>
        <title>{product.title} | متجر جملة السعودية - شحن مجاني</title>
        <meta name="description" content={`اشتري ${product.title} بسعر ${finalPrice.toFixed(2)} ريال سعودي من متجر جملة السعودية. شحن مجاني وتوصيل سريع (1-3 أيام). استرجاع مجاني خلال 14 يوم. ${product.description?.substring(0, 100)}`} />
        <meta name="keywords" content={`${product.title}, ${product.category}, تسوق أونلاين عمان, شحن مجاني`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description?.substring(0, 160)} />
        <meta property="og:image" content={product.mainImage} />
        <meta property="og:url" content={`https://jomla-ksa.storesads.shop/product/${product.id}`} />
        <meta property="product:price:amount" content={finalPrice.toFixed(2)} />
        <meta property="product:price:currency" content="SAR" />
        <meta property="product:availability" content={product.availability} />
        <link rel="canonical" href={`https://jomla-ksa.storesads.shop/product/${product.id}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <div className="product-details-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div className="product-gallery" style={{ flex: '1', minWidth: '300px' }}>
          <div className="main-image-frame" style={{ marginBottom: '15px', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff', minHeight: '400px' }}>
            <ProductImage src={mainImage} alt={product.title} style={{ width: '100%', height: '400px' }} />
          </div>
          <div className="thumbnails" style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            <div onClick={() => setMainImage(product.mainImage)} style={{ width: '70px', height: '70px', borderRadius: '5px', cursor: 'pointer', border: mainImage === product.mainImage ? '2px solid #007A3D' : '1px solid #eee', overflow: 'hidden', backgroundColor: '#ffffff' }}>
              <ProductImage src={product.mainImage} alt="Main" style={{ width: '70px', height: '70px' }} />
            </div>
            {(product.gallery || []).map((img, idx) => (
              <div key={idx} onClick={() => setMainImage(img)} style={{ width: '70px', height: '70px', borderRadius: '5px', cursor: 'pointer', border: mainImage === img ? '2px solid #007A3D' : '1px solid #eee', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                <ProductImage src={img} alt={`Gallery ${idx}`} style={{ width: '70px', height: '70px' }} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info" style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>{product.title}</h1>
          <div style={{ color: '#888', marginBottom: '20px' }}>{product.category}</div>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ 
              padding: '5px 15px', 
              borderRadius: '5px', 
              backgroundColor: product.availability === 'in stock' ? '#d4edda' : '#f8d7da',
              color: product.availability === 'in stock' ? '#155724' : '#721c24',
              fontWeight: 'bold'
            }}>
              {product.availabilityAr}
            </span>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px', color: '#007A3D' }}>
            {product.availability === 'in stock' ? (
              salePrice > 0 && salePrice < price ? (
                <>
                  <span style={{ color: '#CE1126', marginLeft: '15px' }}>{salePrice.toFixed(2)} ريال</span>
                  <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.2rem' }}>{price.toFixed(2)} ريال</span>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#28a745', marginTop: '5px' }}>وفر {((price - salePrice) / price * 100).toFixed(0)}%</span>
                </>
              ) : (
                <span>{price.toFixed(2)} ريال سعودي</span>
              )
            ) : (
              <span style={{ color: '#999' }}>غير متوفر حالياً</span>
            )}
          </div>

          <div style={{ marginBottom: '30px', lineHeight: '1.6', color: '#555' }}>
            <p>{product.description}</p>
          </div>

          <div style={{ background: '#f0f9f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ margin: '5px 0', color: '#007A3D' }}>✅ شحن مجاني لجميع مناطق السعودية</p>
            <p style={{ margin: '5px 0', color: '#007A3D' }}>✅ توصيل سريع (1-3 أيام عمل)</p>
            <p style={{ margin: '5px 0', color: '#007A3D' }}>✅ استرجاع مجاني خلال 14 يوم</p>
            <p style={{ margin: '5px 0', color: '#007A3D' }}>✅ ضمان الجودة</p>
          </div>

          <div className="actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {product.availability === 'in stock' && (
              <button 
                onClick={() => {
                  addToCart(product);
                  alert('تمت الإضافة للسلة بنجاح!');
                }}
                style={{ padding: '15px', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                أضف إلى السلة
              </button>
            )}
            <button 
              className="whatsapp-order-btn"
              onClick={() => window.open(`https://wa.me/201110760081?text=مرحباً، أريد طلب المنتج: ${product.title}`, '_blank')}
              style={{ padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              اطلب عبر واتساب
            </button>
          </div>
        </div>
      </div>
      <FloatingButtons />
    </div>
  );
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'data', 'jomla-ksa-products.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(jsonData);

  const paths = products.map((product) => ({
    params: { id: String(product.id) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data', 'jomla-ksa-products.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(jsonData);
  const product = products.find((p) => String(p.id) === params.id);

  return {
    props: {
      product: product || null,
    },
  };
}
