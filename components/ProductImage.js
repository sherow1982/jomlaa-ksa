export default function ProductImage({ src, alt, className = '', style = {} }) {
  const handleError = (e) => {
    const parent = e.target.parentElement;
    if (parent) {
      parent.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#fff;color:#999;font-size:3rem">📦</div>';
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      ...style
    }}>
      <img 
        src={src || '/placeholder.png'} 
        alt={alt || 'منتج'}
        className={className}
        loading="lazy"
        decoding="async"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          backgroundColor: '#ffffff'
        }}
        onError={handleError}
      />
    </div>
  );
}
