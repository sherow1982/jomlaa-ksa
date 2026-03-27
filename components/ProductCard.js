import Link from 'next/link';
import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  const regularPrice = parseFloat(product.regular_price || product.price || 0);
  const salePrice = parseFloat(product.sale_price || product.price || 0);
  const hasDiscount = regularPrice > salePrice && salePrice > 0;
  const discount = hasDiscount ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
  const availability = product.availability || 'in stock';
  const isAvailable = availability === 'in stock';

  return (
    <div className="product-card" style={{ opacity: isAvailable ? 1 : 0.6 }}>
      <div className="product-image-wrapper">
        <ProductImage 
          src={product.image} 
          alt={product.name || 'منتج'}
          className="product-image"
        />
        {!isAvailable && (
          <span className="out-of-stock-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: '#999', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            غير متوفر
          </span>
        )}
        {isAvailable && discount > 0 && (
          <span className="discount-badge" style={{ position: 'absolute', top: '10px', right: '10px', background: '#CE1126', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            -{discount}%
          </span>
        )}
      </div>
      <h3 className="product-title">
        {product.name}
      </h3>
      <div className="product-price-box">
        {isAvailable ? (
          hasDiscount ? (
            <>
              <span className="price-sale">
                {salePrice.toFixed(2)} ريال
              </span>
              <span className="price-regular">
                {regularPrice.toFixed(2)} ريال
              </span>
            </>
          ) : (
            <span className="price-sale">
              {salePrice.toFixed(2)} ريال سعودي
            </span>
          )
        ) : (
          <span className="price-sale" style={{ color: '#999' }}>
            غير متوفر
          </span>
        )}
      </div>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <button className="btn-primary" disabled={!isAvailable}>
          عرض التفاصيل
        </button>
      </Link>
    </div>
  );
}
