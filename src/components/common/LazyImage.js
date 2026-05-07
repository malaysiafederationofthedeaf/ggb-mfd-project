import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, style, fallback, onError, ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let observer;
    let isMounted = true;
    const currentRef = containerRef.current;

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

      if (currentRef) {
        observer.observe(currentRef);
      }
    } else {
      setIsVisible(true);
    }

    return () => {
      isMounted = false;
      if (observer && currentRef) {
        observer.unobserve(currentRef);
        observer.disconnect();
      }
    };
  }, []);

  const handleError = (e) => {
    if (fallback && e.target.src !== fallback) {
      e.target.onerror = null;
      e.target.src = fallback;
      return;
    }
    if (onError) {
      onError(e);
    }
  };

  const imageStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    ...style,
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '120px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          className={className}
          style={imageStyle}
          loading="lazy"
          onError={handleError}
          {...rest}
        />
      ) : (
        <div style={{ height: '120px', width: '100%', background: '#f4f4f4', borderRadius: '8px' }}></div>
      )}
    </div>
  );
};

export default LazyImage;
