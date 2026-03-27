import '../styles/globals.css';
import Layout from '../components/Layout';
import { CartProvider } from '../context/CartContext';
import Head from 'next/head';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TZF4JK3N');`}
      </Script>
      
      {/* Google Analytics 4 */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-3JXGBTCLSP" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-3JXGBTCLSP', {
          page_path: window.location.pathname,
          send_page_view: true
        });`}
      </Script>
      
      {/* Google Merchant Center Conversion Tracking */}
      <Script id="merchant-conversion" strategy="afterInteractive">
        {`gtag('config', 'AW-CONVERSION_ID');`}
      </Script>
      
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Theme & Colors */}
        <meta name="theme-color" content="#007A3D" />
        <meta name="msapplication-TileColor" content="#007A3D" />
        
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Language & Location */}
        <meta name="language" content="Arabic" />
        <meta name="geo.region" content="OM" />
        <meta name="geo.placename" content="Oman" />
        <meta name="geo.position" content="23.5880;58.3829" />
        <meta name="ICBM" content="23.5880, 58.3829" />
        
        {/* Site Verification - Add your codes here */}
        {/* <meta name="google-site-verification" content="YOUR_CODE" /> */}
        {/* <meta name="msvalidate.01" content="YOUR_CODE" /> */}
        
        {/* Open Graph */}
        <meta property="og:site_name" content="متجر عمان" />
        <meta property="og:locale" content="ar_OM" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@omanstore" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="ar" href="https://oman.storesads.shop/" />
        <link rel="alternate" hrefLang="x-default" href="https://oman.storesads.shop/" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://media.taager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://media.taager.com" />
        
        <title>متجر عمان</title>
      </Head>
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TZF4JK3N"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
      </noscript>
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}

export default MyApp;

