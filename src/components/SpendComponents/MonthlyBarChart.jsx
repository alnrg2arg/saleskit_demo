import React from 'react';
import { formatSpend } from '../../utils/formatUtils';

const MonthlyBarChart = ({ monthlyData }) => {
  if (!monthlyData || Object.keys(monthlyData).length === 0) {
    return <div style={{color:'#888',textAlign:'center',marginTop:24}}>월별 데이터 없음</div>;
  }
  
  // 월별 데이터 정렬 (오래된 순)
  const sortedMonths = Object.keys(monthlyData).sort();
  const maxSpend = Math.max(...sortedMonths.map(m => monthlyData[m]));
  
  const barCount = sortedMonths.length;
  const minBarWidth = 18;
  const maxBarWidth = 60; // 넓어져도 되므로 크게 설정
  let barWidthPercent = 100 / barCount;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'flex-end',
        height: 70,
        padding: '0 24px 8px 24px',
        gap: 0,
        width: '100%',
        boxSizing: 'border-box',
        justifyContent: 'space-between'
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
        const val = monthlyData[month];
        const h = maxSpend ? Math.max(8, Math.round((val / maxSpend) * 48)) : 8;
        const displayVal = `${(val / 1e8).toFixed(1)}`;
        return (
          <div
            key={month}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexBasis: `${barWidthPercent}%`,
              minWidth: minBarWidth,
              maxWidth: maxBarWidth,
            }}
          >
            <div style={{fontSize: 11, color: '#222', marginBottom: 2, fontWeight: 500}}>
              {displayVal}
            </div>
            <div style={{height:h,background:'#699bf7',width:'100%',borderRadius:4,marginBottom:4}} title={`${month}: ${formatSpend(val)}`}></div>
            <div style={{fontSize:10,color:'#888',textAlign:'center',width:'100%'}}>{month.slice(2)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyBarChart; 
 
 
 
 
 
 
 