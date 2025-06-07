import React from 'react';
import { formatSpend } from '../../utils/formatUtils';

const ItemMonthlyBarChart = ({ monthlySpend, sortedMonths, maxSpend }) => {
  if (!sortedMonths || sortedMonths.length === 0) {
    return <div style={{color:'#888',textAlign:'center',marginTop:24}}>월간 구매 데이터 없음</div>;
  }
  
  const barCount = sortedMonths.length;
  
  // 컨테이너 내부 padding을 최소화하여 더 많은 공간 확보
  const horizontalPadding = 8;
  
  // 품목 차트는 더 넓은 공간을 차지해야 하므로 바 사이 간격 최소화
  const barSpacing = 1.5;
  
  // 전체 사용 가능 너비 (컨테이너 너비 - 양쪽 패딩)
  const availableWidthPercent = 100 - (horizontalPadding * 2);
  
  // 바 너비를 품목 차트에 맞게 더 두껍게 계산
  const barWidthPercent = (availableWidthPercent / barCount) - barSpacing;
  
  // 차트 컨테이너 높이 증가 - 바를 더 길게 보이게 함
  const chartHeight = 130;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'flex-end',
        height: chartHeight,
        padding: `0 ${horizontalPadding}px 8px ${horizontalPadding}px`,
        width: '100%',
        boxSizing: 'border-box',
        justifyContent: 'space-between', // 차트를 좌우 끝에서 끝까지 배치
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -32,
          right: 12,
          fontSize: 11,
          color: '#888',
          zIndex: 2,
          background: 'white',
          padding: '0 4px'
        }}
      >
        (단위: 억원)
      </span>
      
      {sortedMonths.map(month => {
        const val = monthlySpend[month];
        // 바 높이 계산 - 훨씬 더 길게 설정 (90 -> 120)
        const h = maxSpend ? Math.max(13, Math.round((val / maxSpend) * 110)) : 14;
        const displayVal = `${(val / 1e8).toFixed(1)}`;
        
        // 년도-월 포맷 (예: "2023-01")을 표시용 포맷으로 변환 (예: "23-01")
        const displayMonth = month.slice(2); // "2023-01" -> "23-01"
        
        return (
          <div
            key={month}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: `${barWidthPercent}%`, // 동적으로 계산된 너비 적용
              marginLeft: `${barSpacing/2}%`,
              marginRight: `${barSpacing/2}%`,
              flexGrow: 1,
            }}
          >
            <div style={{fontSize: 11, color: '#222', marginBottom: 2, fontWeight: 500}}>
              {displayVal}
            </div>
            <div 
              style={{
                height: h,
                background: '#699bf7',
                width: '100%', // 컨테이너의 전체 너비 사용
                borderRadius: 4,
                marginBottom: 4
              }} 
              title={`${month}: ${formatSpend(val)}`}
            />
            <div style={{fontSize: 10, color: '#888', textAlign: 'center', width: '100%'}}>
              {displayMonth}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemMonthlyBarChart; 
 
 
 
 
 
 
 