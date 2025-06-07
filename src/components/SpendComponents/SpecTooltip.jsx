import React, { useState } from 'react';

// 커스텀 툴팁 컴포넌트
const SpecTooltip = ({ displayText, fullText }) => {
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const isTruncated = displayText.endsWith('...') && fullText.length > displayText.length;
  
  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };
  
  // 분리: ...만 별도 span으로 감싸기
  let mainText = displayText;
  let ellipsis = null;
  
  if (isTruncated) {
    mainText = displayText.slice(0, -3);
    ellipsis = (
      <span
        className="spec-ellipsis"
        style={{ color: '#888', cursor: 'pointer' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMouseMove}
      >
        ...
        {hover && (
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
            {fullText}
          </span>
        )}
      </span>
    );
  }
  
  return (
    <span
      style={{
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        maxWidth: 240,
        verticalAlign: 'middle'
      }}
    >
      {mainText}{ellipsis}
    </span>
  );
};

export default SpecTooltip; 
 
 
 
 
 
 
 