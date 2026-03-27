import { useRouter } from 'next/router';
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
        <link rel="canonical" href={`https://oman.storesads.shop/seo/${page.slug}`} />
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
