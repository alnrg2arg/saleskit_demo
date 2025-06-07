import React from 'react';

const AnimatedChart = ({ 
  data = [], 
  containerWidth = 1200, 
  animated = true,
  barColor = "#8eb4f9",
  animationDuration = 1000 
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        데이터가 없습니다.
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.amount || 0), 1);
  const barCount = data.length;
  
  // 컨테이너 너비를 기준으로 차트 크기 계산
  const chartPadding = 40;
  const availableWidth = containerWidth - chartPadding;
  const barSpacing = Math.max(10, Math.min(20, availableWidth / barCount * 0.2));
  const totalSpacing = barSpacing * (barCount - 1);
  
  const calculatedBarWidth = Math.max(20, (availableWidth - totalSpacing) / barCount);
  const actualChartWidth = (calculatedBarWidth * barCount) + totalSpacing + chartPadding;
  const finalChartWidth = Math.min(actualChartWidth, containerWidth);
  
  const chartHeight = 140;
  const topMargin = 25;
  const bottomMargin = 20;
  const availableBarHeight = chartHeight - topMargin - bottomMargin;
  
  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <svg 
        width={finalChartWidth} 
        height={chartHeight} 
        style={{ 
          overflow: 'visible',
          maxWidth: '100%'
        }}
      >
        {data.map((item, index) => {
          const barHeight = (item.amount / maxAmount) * availableBarHeight;
          const x = chartPadding / 2 + index * (calculatedBarWidth + barSpacing);
          const y = chartHeight - barHeight - bottomMargin;
          
          return (
            <g key={`bar-${index}`}>
              {/* 막대 */}
              <rect
                x={x}
                y={y}
                width={calculatedBarWidth}
                height={barHeight}
                fill={barColor}
                rx="2"
                style={{
                  animation: animated ? `slideUp ${animationDuration}ms ease-out ${index * 50}ms both` : 'none'
                }}
              />
              
              {/* 금액 표시 */}
              <text
                x={x + calculatedBarWidth / 2}
                y={Math.max(15, y - 5)}
                textAnchor="middle"
                fontSize={calculatedBarWidth > 50 ? "10" : "8"}
                fill="#666"
                style={{
                  animation: animated ? `fadeIn 400ms ease-out ${800 + index * 50}ms both` : 'none'
                }}
              >
                {typeof item.amount === 'number' ? item.amount.toFixed(1) : item.amount}
              </text>
              
              {/* 월 표시 */}
              <text
                x={x + calculatedBarWidth / 2}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize={calculatedBarWidth > 50 ? "10" : "8"}
                fill="#666"
              >
                {item.month || item.label}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedChart; 