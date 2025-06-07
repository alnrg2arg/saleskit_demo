import React from 'react';

const MaterialPriceLineChart = ({ priceHistory, sortedDates, maxPrice, rawMaterial }) => {
  if (!sortedDates || sortedDates.length === 0) {
    return <div style={{color:'#888',textAlign:'center',marginTop:24}}>원자재 가격 데이터 없음</div>;
  }
  
  // 차트 사이즈와 여백 설정
  const chartHeight = 120; // 단가/시세 차트 높이 (90px * 1.3)
  const ratioChartHeight = 80; // 비율 차트 높이 (60px * 1.3)
  const chartGap = 15; // 차트 사이 간격 감소
  const chartWidth = '66.67%'; // 넓이를 2/3로 줄임
  const paddingHorizontal = 20;
  const paddingBottom = 20; // X축 레이블 여백 감소
  
  // SVG 뷰포트 설정
  const svgHeight = chartHeight + paddingBottom;
  const ratioSvgHeight = ratioChartHeight + paddingBottom;
  const totalHeight = svgHeight + ratioSvgHeight + chartGap;
  const labelHeight = 25; // 레이블 위치 조정
  
  // X축 간격 계산
  const dataPointCount = sortedDates.length;
  
  // 가상 시세 데이터 생성 (단가의 -50%~+50% 범위 내 랜덤값)
  const marketPriceHistory = {};
  sortedDates.forEach(date => {
    const basePrice = priceHistory[date] || 0;
    // -50% ~ +50% 사이의 랜덤 변동률 생성
    const variation = Math.random() * 1.0 - 0.5; // -0.5 ~ 0.5
    marketPriceHistory[date] = basePrice * (1 + variation);
  });
  
  // 시세/단가 비율 계산
  const priceRatioHistory = {};
  sortedDates.forEach(date => {
    const basePrice = priceHistory[date] || 1; // 0으로 나누는 것 방지
    const marketPrice = marketPriceHistory[date] || 0;
    // 비율 계산 (시세/단가)
    priceRatioHistory[date] = marketPrice / basePrice;
  });
  
  // 비율의 최대/최소값 계산
  const ratios = sortedDates.map(date => priceRatioHistory[date]);
  const maxRatio = Math.max(...ratios, 1.5); // 최소 1.5
  const minRatio = Math.min(...ratios, 0.5); // 최대 0.5
  const ratioRange = maxRatio - minRatio;
  
  // 최소 1의 가격을 가지도록 보정 (두 데이터셋 모두 고려)
  const allPrices = [
    ...sortedDates.map(d => priceHistory[d] || 0),
    ...sortedDates.map(d => marketPriceHistory[d] || 0)
  ];
  const overallMaxPrice = Math.max(...allPrices, 1);
  const effectiveMaxPrice = Math.max(overallMaxPrice, 1);
  
  // 날짜를 보기 좋게 포맷팅하는 함수
  const formatDate = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // 년-월-일 형식으로 변환 (예: 2023-01-10 -> 23-01-10)
      return `${parts[0].slice(2)}-${parts[1]}-${parts[2]}`;
    }
    return dateStr;
  };
  
  // X축 레이블 표시 간격 결정 (데이터 포인트가 많을 경우 일부만 표시)
  const calculateLabelInterval = (count) => {
    if (count <= 10) return 1;
    if (count <= 20) return 2;
    if (count <= 40) return 4;
    return Math.ceil(count / 10); // 최대 10개 정도의 레이블만 표시
  };
  
  const labelInterval = calculateLabelInterval(dataPointCount);
  
  // SVG path 명령어 생성 (단가용)
  const generatePathDForPrice = () => {
    if (sortedDates.length === 0) return '';
    
    // 첫 번째 데이터 포인트에서 시작
    const firstDate = sortedDates[0];
    const firstPrice = priceHistory[firstDate] || 0;
    const firstY = chartHeight - ((firstPrice / effectiveMaxPrice) * chartHeight);
    
    // moveTo로 시작
    let pathD = `M 0,${firstY}`;
    
    // 나머지 데이터 포인트에 대해 lineTo 추가
    sortedDates.forEach((date, index) => {
      const x = (index / (dataPointCount - 1)) * 100; // 백분율 값
      const price = priceHistory[date] || 0;
      const y = chartHeight - ((price / effectiveMaxPrice) * chartHeight);
      pathD += ` L ${x}%,${y}`;
    });
    
    return pathD;
  };
  
  // SVG path 명령어 생성 (시세용)
  const generatePathDForMarket = () => {
    if (sortedDates.length === 0) return '';
    
    // 첫 번째 데이터 포인트에서 시작
    const firstDate = sortedDates[0];
    const firstPrice = marketPriceHistory[firstDate] || 0;
    const firstY = chartHeight - ((firstPrice / effectiveMaxPrice) * chartHeight);
    
    // moveTo로 시작
    let pathD = `M 0,${firstY}`;
    
    // 나머지 데이터 포인트에 대해 lineTo 추가
    sortedDates.forEach((date, index) => {
      const x = (index / (dataPointCount - 1)) * 100; // 백분율 값
      const price = marketPriceHistory[date] || 0;
      const y = chartHeight - ((price / effectiveMaxPrice) * chartHeight);
      pathD += ` L ${x}%,${y}`;
    });
    
    return pathD;
  };
  
  // SVG path 명령어 생성 (비율용)
  const generatePathDForRatio = () => {
    if (sortedDates.length === 0) return '';
    
    // 첫 번째 데이터 포인트에서 시작
    const firstDate = sortedDates[0];
    const firstRatio = priceRatioHistory[firstDate] || 1;
    // 비율값을 Y좌표로 변환 (높을수록 위로)
    const firstY = ratioChartHeight - ((firstRatio - minRatio) / ratioRange) * ratioChartHeight;
    
    // moveTo로 시작
    let pathD = `M 0,${firstY}`;
    
    // 나머지 데이터 포인트에 대해 lineTo 추가
    sortedDates.forEach((date, index) => {
      const x = (index / (dataPointCount - 1)) * 100; // 백분율 값
      const ratio = priceRatioHistory[date] || 1;
      const y = ratioChartHeight - ((ratio - minRatio) / ratioRange) * ratioChartHeight;
      pathD += ` L ${x}%,${y}`;
    });
    
    return pathD;
  };
  
  // 데이터 포인트 계산 함수 (단가용)
  const calculatePricePoints = () => {
    return sortedDates.map((date, index) => {
      const x = (index / (dataPointCount - 1)) * 100; // 백분율 값
      const price = priceHistory[date] || 0;
      const y = chartHeight - ((price / effectiveMaxPrice) * chartHeight);
      return { x, y, price, date };
    });
  };
  
  // 데이터 포인트 계산 함수 (시세용)
  const calculateMarketPoints = () => {
    return sortedDates.map((date, index) => {
      const x = (index / (dataPointCount - 1)) * 100; // 백분율 값
      const price = marketPriceHistory[date] || 0;
      const y = chartHeight - ((price / effectiveMaxPrice) * chartHeight);
      return { x, y, price, date };
    });
  };
  
  // 데이터 포인트 계산 함수 (비율용)
  const calculateRatioPoints = () => {
    return sortedDates.map((date, index) => {
      const x = (index / (dataPointCount - 1)) * 100; // 백분율 값
      const ratio = priceRatioHistory[date] || 1;
      const y = ratioChartHeight - ((ratio - minRatio) / ratioRange) * ratioChartHeight;
      return { x, y, ratio, date };
    });
  };
  
  const pricePoints = calculatePricePoints();
  const marketPoints = calculateMarketPoints();
  const ratioPoints = calculateRatioPoints();
  
  // 색상 정의
  const priceColor = "#0066FF"; // 단가용 색상
  const marketColor = "#FF6600"; // 시세용 색상
  const ratioColor = "#22AA22"; // 비율용 색상
  
  return (
    <div style={{ 
      position: 'relative', 
      height: totalHeight + 5, 
      width: chartWidth, 
      padding: `0 ${paddingHorizontal}px`, 
      marginBottom: 0, 
      marginTop: 20,
      marginLeft: '10px',
      marginRight: 'auto'
    }}>
      {/* 범례는 간결하게 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        gap: '10px',
        position: 'absolute',
        top: -15,
        right: 20,
        fontSize: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, backgroundColor: priceColor, marginRight: 3 }}></div>
          <span>단가</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, backgroundColor: marketColor, marginRight: 3 }}></div>
          <span>시세</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, backgroundColor: ratioColor, marginRight: 3 }}></div>
          <span>시세/단가 비율</span>
        </div>
      </div>
      
      {/* 원자재 정보 */}
      <span
        style={{
          position: 'absolute',
          top: -40,
          left: 12,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000',
          zIndex: 2
        }}
      >
        주요 원자재
      </span>
      
      {/* 첫 번째 차트 - 단가와 시세 */}
      <svg width="100%" height={svgHeight} style={{ overflow: 'visible', marginTop: 5 }}>
        {/* Y축 라벨 및 그리드 라인 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chartHeight - (chartHeight * ratio);
          const price = Math.round(effectiveMaxPrice * ratio);
          
          return (
            <React.Fragment key={`grid-${ratio}`}>
              <line 
                x1="0" 
                y1={y} 
                x2="100%" 
                y2={y} 
                stroke="#eee" 
                strokeWidth="1" 
              />
              <text 
                x="-5" 
                y={y + 4} 
                fontSize="10" 
                textAnchor="end" 
                fill="#888"
              >
                {price.toLocaleString()}
              </text>
            </React.Fragment>
          );
        })}
        
        {/* 단가 라인 그리기 - path 사용 */}
        <path
          d={generatePathDForPrice()}
          fill="none"
          stroke={priceColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 시세 라인 그리기 - path 사용 */}
        <path
          d={generatePathDForMarket()}
          fill="none"
          stroke={marketColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3,3" // 점선으로 표시
        />
        
        {/* 단가 데이터 포인트 간 직접 선으로 연결 */}
        {pricePoints.length > 1 && pricePoints.map((point, i) => {
          if (i === pricePoints.length - 1) return null; // 마지막 포인트는 다음 포인트가 없음
          
          const nextPoint = pricePoints[i + 1];
          return (
            <line
              key={`price-line-${i}`}
              x1={`${point.x}%`}
              y1={point.y}
              x2={`${nextPoint.x}%`}
              y2={nextPoint.y}
              stroke={priceColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        
        {/* 시세 데이터 포인트 간 직접 선으로 연결 */}
        {marketPoints.length > 1 && marketPoints.map((point, i) => {
          if (i === marketPoints.length - 1) return null; // 마지막 포인트는 다음 포인트가 없음
          
          const nextPoint = marketPoints[i + 1];
          return (
            <line
              key={`market-line-${i}`}
              x1={`${point.x}%`}
              y1={point.y}
              x2={`${nextPoint.x}%`}
              y2={nextPoint.y}
              stroke={marketColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="3,3" // 점선으로 표시
            />
          );
        })}
        
        {/* 단가 데이터 포인트 */}
        {pricePoints.map((point, index) => {
          return (
            <circle
              key={`price-point-${point.date}`}
              cx={`${point.x}%`}
              cy={point.y}
              r="4"
              fill={priceColor}
              stroke="#fff"
              strokeWidth="1.5"
              data-price={point.price}
              data-date={point.date}
            />
          );
        })}
        
        {/* 시세 데이터 포인트 */}
        {marketPoints.map((point, index) => {
          return (
            <circle
              key={`market-point-${point.date}`}
              cx={`${point.x}%`}
              cy={point.y}
              r="3"
              fill={marketColor}
              stroke="#fff"
              strokeWidth="1"
              data-price={point.price}
              data-date={point.date}
            />
          );
        })}
      </svg>
      
      {/* 두 번째 차트 - 시세/단가 비율 */}
      <svg 
        width="100%" 
        height={ratioSvgHeight} 
        style={{ 
          overflow: 'visible', 
          marginTop: chartGap - 10,
        }}
      >
        {/* Y축 라벨 및 그리드 라인 */}
        {[0, 0.25, 0.5, 0.75, 1].map((r) => {
          const y = ratioChartHeight - (ratioChartHeight * r);
          const ratioValue = minRatio + (ratioRange * r);
          
          return (
            <React.Fragment key={`ratio-grid-${r}`}>
              <line 
                x1="0" 
                y1={y} 
                x2="100%" 
                y2={y} 
                stroke="#eee" 
                strokeWidth="1" 
              />
              <text 
                x="-5" 
                y={y + 4} 
                fontSize="10" 
                textAnchor="end" 
                fill="#888"
              >
                {ratioValue.toFixed(2)}
              </text>
            </React.Fragment>
          );
        })}
        
        {/* 비율 1.0 기준선 (시세=단가) */}
        <line 
          x1="0" 
          y1={ratioChartHeight - ((1.0 - minRatio) / ratioRange) * ratioChartHeight} 
          x2="100%" 
          y2={ratioChartHeight - ((1.0 - minRatio) / ratioRange) * ratioChartHeight} 
          stroke="#aaa" 
          strokeWidth="1" 
          strokeDasharray="5,5"
        />
        <text 
          x="-5" 
          y={ratioChartHeight - ((1.0 - minRatio) / ratioRange) * ratioChartHeight + 4} 
          fontSize="10" 
          textAnchor="end" 
          fill="#666" 
          fontWeight="bold"
        >
          1.00
        </text>
        
        {/* 비율 라인 그리기 - path 사용 */}
        <path
          d={generatePathDForRatio()}
          fill="none"
          stroke={ratioColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 비율 데이터 포인트 간 직접 선으로 연결 */}
        {ratioPoints.length > 1 && ratioPoints.map((point, i) => {
          if (i === ratioPoints.length - 1) return null; // 마지막 포인트는 다음 포인트가 없음
          
          const nextPoint = ratioPoints[i + 1];
          return (
            <line
              key={`ratio-line-${i}`}
              x1={`${point.x}%`}
              y1={point.y}
              x2={`${nextPoint.x}%`}
              y2={nextPoint.y}
              stroke={ratioColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        
        {/* 비율 데이터 포인트 */}
        {ratioPoints.map((point, index) => {
          return (
            <circle
              key={`ratio-point-${point.date}`}
              cx={`${point.x}%`}
              cy={point.y}
              r="3"
              fill={ratioColor}
              stroke="#fff"
              strokeWidth="1"
              data-ratio={point.ratio.toFixed(2)}
              data-date={point.date}
            />
          );
        })}
        
        {/* X축 레이블 (선택된 날짜만) - 비율 차트에만 표시 */}
        {sortedDates.map((date, index) => {
          // 데이터 포인트가 많을 경우 일부 레이블만 표시
          if (index % labelInterval !== 0 && index !== dataPointCount - 1) return null;
          
          const x = `${(index / (dataPointCount - 1)) * 100}%`;
          const displayDate = formatDate(date);
          
          return (
            <text
              key={`date-${date}`}
              x={x}
              y={ratioChartHeight + labelHeight}
              fontSize="9"
              textAnchor="middle"
              fill="#888"
              style={{ transform: 'rotate(30deg)', transformOrigin: `${x} ${ratioChartHeight + 20}px` }}
            >
              {displayDate}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default MaterialPriceLineChart; 
 
 
 
 
 
 
 