import React, { useState } from 'react';

// 커스텀 툴팁 + ... 처리 컴포넌트
const TruncateTooltip = ({ value, max = 25 }) => {
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const isTruncated = value && value.length > max;
  const displayText = isTruncated ? value.slice(0, max) + '...' : value;
  
  const handleMouseMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
  
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
        width: '100%',
        textAlign: 'center',
        cursor: isTruncated ? 'pointer' : 'default',
        position: 'relative',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMouseMove}
      title={value} // Add native HTML tooltip as fallback
    >
      {displayText}
      {isTruncated && hover && (
        <span
          style={{
            position: 'fixed',
            left: mouse.x + 12,
            top: mouse.y + 16,
            background: '#fff',
            color: '#222',
            border: '1px solid #bbb',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            padding: '8px 12px',
            zIndex: 9999,
            minWidth: 200,
            maxWidth: 400,
            fontSize: 13,
            whiteSpace: 'pre-line',
            wordBreak: 'break-all',
            pointerEvents: 'none'
          }}
        >
          {value}
        </span>
      )}
    </span>
  );
};

export default TruncateTooltip; 
 
 
 
 
 
 
 