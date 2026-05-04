import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, style, fallback }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let observer;
    let isMounted = true;

    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Only load when the element is very close (within 50px)
            if (entry.isIntersecting) {
              if (isMounted) {
                setIsVisible(true);
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '50px' } // very tight margin
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    } else {
      setIsVisible(true);
    }

    return () => {
      isMounted = false;
      if (observer && containerRef.current) {
        observer.unobserve(containerRef.current);
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        minHeight: '120px', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          onError={(e) => {
            if (fallback && e.target.src !== fallback) {
              e.target.onerror = null;
              e.target.src = fallback;
            }
          }}
        />
      ) : (
        <div style={{ height: '120px', width: '100%', background: '#f4f4f4', borderRadius: '8px' }}></div>
      )}
    </div>
  );
};

export default LazyImage;
