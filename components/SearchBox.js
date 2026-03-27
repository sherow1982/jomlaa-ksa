import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import products from '../data/jomla-ksa-products.json';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن المنتجات..."
          className="search-input"
        />
        <button className="search-button" aria-label="بحث">
          🔍
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(product => (
            <div
              key={product.id}
              className="search-result-item"
              onClick={() => handleProductClick(product.id)}
            >
              <img src={product.image} alt={product.name} />
              <div className="result-info">
                <h4>{product.name}</h4>
                <p className="result-price">
                  {product.sale_price || product.price} ريال
                  {product.sale_price && (
                    <span className="old-price">{product.price} ريال</span>
                  )}
                </p>
                <p className="result-rating">⭐ {product.average_rating || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .search-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 50px;
          padding: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .search-input {
          flex: 1;
          border: none;
          padding: 12px 20px;
          font-size: 16px;
          outline: none;
          background: transparent;
          direction: rtl;
        }

        .search-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .search-button:hover {
          transform: scale(1.05);
        }

        .search-results {
          position: absolute;
          top: 100%;
          right: 0;
          left: 0;
          background: white;
          border-radius: 16px;
          margin-top: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          max-height: 400px;
          overflow-y: auto;
          z-index: 100;
        }

        .search-result-item {
          display: flex;
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }

        .search-result-item:hover {
          background: #f8f9fa;
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .search-result-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          margin-left: 12px;
        }

        .result-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .result-info h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .result-price {
          margin: 4px 0;
          font-size: 16px;
          font-weight: bold;
          color: #667eea;
        }

        .old-price {
          margin-right: 8px;
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
          font-weight: normal;
        }

        .result-rating {
          margin: 0;
          font-size: 12px;
          color: #666;
        }

        @media (max-width: 768px) {
          .search-container {
            max-width: 100%;
          }

          .search-input {
            font-size: 14px;
            padding: 10px 16px;
          }

          .search-button {
            width: 44px;
            height: 44px;
            font-size: 18px;
          }

          .search-result-item img {
            width: 50px;
            height: 50px;
          }

          .result-info h4 {
            font-size: 13px;
          }

          .result-price {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
