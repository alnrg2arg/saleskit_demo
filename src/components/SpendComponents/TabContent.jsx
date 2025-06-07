import React, { useRef, useEffect } from 'react';
import { Frame35308 } from '../../components/Frame35308';
import ItemMonthlyBarChart from './ItemMonthlyBarChart';
import MaterialPriceLineChart from './MaterialPriceLineChart';
import { getMarketForecastData, getStrategyData, calculateItemMonthlySpend, calculateSupplierMetrics } from '../../utils/dataUtils';
import { generateSupplierCards } from './SupplierCardGenerator';
import MarketForecastBox from './MarketForecastBox';

const TabContent = ({ 
  activeTab,
  supplierCards: defaultSupplierCards,
  itemMonthlyData: defaultItemMonthlyData,
  materialPriceData = {}, // Add materialPriceData prop with default empty object
  rawMaterial = '',
  selectedRowData = null,
  selectedRow = 0,
  materialList = []
}) => {
  // Get selected material info
  const selectedMaterial = materialList[selectedRow] || materialList[0] || {};
  
  // Calculate item monthly data for the selected row if it's not the default one
  const itemMonthlyData = React.useMemo(() => {
    // Calculate for any selected row (including rank 1)
    const rows = materialPriceData.allRows || [];
    if (rows.length > 0 && selectedMaterial && selectedMaterial.material_name) {
      return calculateItemMonthlySpend(rows, selectedMaterial.material_name);
    }
    // Fallback to default data
    return defaultItemMonthlyData;
  }, [selectedRow, selectedMaterial, materialPriceData.allRows, defaultItemMonthlyData]);
  
  // Calculate supplier cards for the selected row
  const supplierCards = React.useMemo(() => {
    // Calculate for any selected row (including rank 1)
    const rows = materialPriceData.allRows || [];
    if (rows.length > 0 && selectedMaterial && selectedMaterial.material_name) {
      const metrics = calculateSupplierMetrics(rows, selectedMaterial.material_name);
      console.log("Metrics for supplier cards:", metrics);
      // Use topSuppliers from metrics
      if (metrics && metrics.topSuppliers && metrics.topSuppliers.length > 0) {
        const cards = generateSupplierCards(metrics.topSuppliers, metrics);
        console.log("Generated supplier cards:", cards);
        return cards;
      }
    }
    // Fallback to default data
    console.log("Using default supplier cards:", defaultSupplierCards);
    return defaultSupplierCards || [];
  }, [selectedRow, selectedMaterial, materialPriceData.allRows, defaultSupplierCards]);
  
  // 원자재 시세 탭에서 사용할 시장 전망 데이터 가져오기
  const marketForecastData = React.useMemo(() => {
    if (activeTab === 'price') {
      const material = selectedRowData?.raw_material || rawMaterial;
      if (material) {
        // allData는 전체 엑셀 데이터를 의미합니다.
        // 여기서는 materialPriceData에서 사용된 rows를 활용한다고 가정합니다.
        return getMarketForecastData(materialPriceData.allRows || [], material);
      }
    }
    return null;
  }, [activeTab, rawMaterial, selectedRowData, materialPriceData.allRows]);
  
  // 초기전략 탭에서 사용할 데이터 가져오기
  const strategyData = React.useMemo(() => {
    if (activeTab === 'strategy') {
      const material = selectedRowData?.raw_material || rawMaterial;
      if (material) {
        return getStrategyData(materialPriceData.allRows || [], material);
      }
    }
    return {
      marketAnalysis: '',
      priceAnalysis: '',
      strategy: ''
    };
  }, [activeTab, rawMaterial, selectedRowData, materialPriceData.allRows]);

  // Add log to debug selectedRow and selectedMaterial
  console.log('Selected Row: ', selectedRow);
  console.log('Selected Material: ', selectedMaterial);
  console.log('Calculated supplier cards: ', supplierCards);
  console.log('Item Monthly Data: ', itemMonthlyData);

  // Format number to display with 3 decimal places
  const formatWithDecimals = (value) => {
    if (typeof value === 'number') {
      // Round at the 4th decimal place, then show 3 decimal places
      return (Math.round(value * 10000) / 10000).toFixed(3);
    } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      // Convert string to number, round at 4th decimal place, then show 3 decimal places
      return (Math.round(parseFloat(value) * 10000) / 10000).toFixed(3);
    }
    return value;
  };

  // 탭 컨텐츠 구조화
  const tabContents = {
    spend: (
      <div className="overlap-13">
        <div className="frame-25">
          <div className="text-wrapper-45">공급업체별 구매 비용</div>
        </div>
        
        {/* 공급업체 카드를 동적으로 생성 */}
        {supplierCards.length === 0 ? (
          <div style={{padding: '20px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px', margin: '10px 0'}}>
            공급업체 정보가 없습니다.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {supplierCards.map((card, index) => (
              <Frame35308 
                key={`supplier-card-${index}`}
                className={index === 0 ? "frame-instance" : "frame-35307-instance"}
                supplierName={card.supplierName} 
                supplierSpend={formatWithDecimals(card.supplierSpend)} 
                lastDate={card.lastDate} 
                orderCount={card.orderCount}
                orderQuantity={formatWithDecimals(card.quantity)}
                orderUnit={card.unit}
                lastPrice={formatWithDecimals(card.lastPrice)}
              />
            ))}
          </div>
        )}
        
        {/* 품목 월간 구매 비용 차트 */}
        <div className="frame-26" style={{ marginTop: '20px' }}>
          <div className="text-wrapper-45">품목 월간 구매 비용</div>
        </div>
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '15px 0', 
          marginTop: '10px',
          position: 'relative',
          height: '190px',
          overflow: 'hidden'
        }}>
          <ItemMonthlyBarChart 
            monthlySpend={itemMonthlyData.monthlySpend} 
            sortedMonths={itemMonthlyData.sortedMonths} 
            maxSpend={itemMonthlyData.maxSpend} 
          />
        </div>
        
        {/* 품목 구매 비용 섹션 - 원래 위치 유지 */}
        <div className="frame-26">
          <div className="text-wrapper-45">품목 구매 비용</div>
        </div>
        
        {/* 품목 구매 비용 차트를 위한 공간 - 300px 아래로 */}
        <div style={{
          background: '#fff', 
          borderRadius: '16px', 
          marginTop: '300px',
          position: 'relative',
          height: '0px',
          overflow: 'hidden'
        }}>
          {/* 이곳에 품목 구매 비용에 관한 차트가 들어갈 수 있음 */}
        </div>
      </div>
    ),
    price: (
      <div className="overlap-13" style={{ minHeight: 180, borderRadius: 16, padding: '15px' }}>
        {/* 주요 원자재 제목과 아이콘 제거 */}
        
        {/* 차트와 박스를 감싸는 Flex 컨테이너 */}
        <div style={{
          display: 'flex',
          width: '100%',
          gap: '20px',
          marginTop: '10px',
          position: 'relative',
          minHeight: '400px'
        }}>
          {/* 원자재 시세 차트 - 415px 더 넓게 */}
          <div style={{ 
            borderRadius: '16px', 
            padding: '15px',
            position: 'relative',
            flex: '0 0 calc(100% - 400px + 415px)', // 원래 공간(100% - 박스 너비) + 415px 추가
            backgroundColor: 'transparent', // 배경 제거
            zIndex: 1,
            marginTop: '5px' // 5px 아래로 이동
          }}>
            <MaterialPriceLineChart 
              priceHistory={materialPriceData.priceHistory || {}} 
              sortedDates={materialPriceData.sortedDates || []} 
              maxPrice={materialPriceData.maxPrice || 0} 
              rawMaterial={selectedRowData?.raw_material || rawMaterial}
            />
          </div>
          
          {/* 차트 옆의 하늘색 테두리 박스 */}
          <div style={{
            width: '415px', // 15px 추가
            border: '1px solid #699bf7',
            borderRadius: '16px',
            backgroundColor: '#fff',
            marginTop: '15px',
            marginBottom: '5px', // 아래쪽 마진 5px 추가
            position: 'absolute', // relative에서 absolute로 변경
            right: '-15px', // 오른쪽에서 15px 왼쪽으로
            height: '300px', // 명시적인 높이 설정
            padding: '0', // 패딩 제거하고 내부 컨텐츠에 패딩 적용
            boxSizing: 'border-box',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10 // 높은 z-index 값 추가
          }}>
            {/* 박스 타이틀 영역 */}
            <div style={{
              borderBottom: '1px solid #699bf7',
              padding: '10px 15px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#699bf7', // 타이틀 박스에 배경색 추가
              color: '#fff'
            }}>
              {/* 타이틀 텍스트 */}
              <div style={{
                color: '#fff', // 텍스트 색상을 흰색으로 변경
                fontFamily: 'Pretendard-Medium, Helvetica',
                fontSize: '16px',
                fontWeight: '500'
              }}>시세 전망</div>
            </div>
            
            {/* 박스 컨텐츠 영역 - 시장 전망 데이터로 채우기 */}
            <MarketForecastBox marketData={marketForecastData} />
          </div>
        </div>
      </div>
    ),
    strategy: (
      <div className="overlap-13" style={{ minHeight: 180, background: '#fff', borderRadius: 16, padding: '15px' }}>
        {/* 초기전략 도출 헤더 */}
        <div className="frame-26" style={{ marginTop: '5px', marginBottom: '5px' }}>
          <div className="text-wrapper-45">초기전략 도출</div>
        </div>
        
        {/* 헤더와 박스 사이 간격 확보 */}
        <div style={{ height: '45px' }}></div>
        
        {/* 차트와 박스를 감싸는 Flex 컨테이너 */}
        <div style={{
          display: 'flex',
          width: '100%',
          gap: '15px',
          position: 'relative',
          height: '280px' // 고정 높이 설정
        }}>
          {/* 왼쪽 박스 영역 - 세로로 두 개 배치 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            flex: '0 0 38%', // 왼쪽 영역 너비 조정
            height: '100%' // 부모 높이에 맞춤
          }}>
            {/* 왼쪽 첫 번째 박스 */}
            <div style={{
              border: '1px solid #699bf7',
              borderRadius: '12px',
              backgroundColor: '#fff',
              padding: '10px',
              height: 'calc(50% - 7.5px)', // 정확히 절반 높이(gap 고려)
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 첫 번째 박스 타이틀 */}
              <div style={{
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '6px',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '13px',
                color: '#333'
              }}>
                시장 및 공급망
              </div>
              
              {/* 내용 영역 */}
              <div style={{ 
                fontSize: '12px', 
                lineHeight: '1.4',
                flex: '1',
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {strategyData.marketAnalysis}
              </div>
            </div>
            
            {/* 왼쪽 두 번째 박스 */}
            <div style={{
              border: '1px solid #699bf7',
              borderRadius: '12px',
              backgroundColor: '#fff',
              padding: '10px',
              height: 'calc(50% - 7.5px)', // 정확히 절반 높이(gap 고려)
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 두 번째 박스 타이틀 */}
              <div style={{
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '6px',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '13px',
                color: '#333'
              }}>
                시세
              </div>
              
              {/* 내용 영역 */}
              <div style={{ 
                fontSize: '12px', 
                lineHeight: '1.4',
                flex: '1',
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {strategyData.priceAnalysis}
              </div>
            </div>
          </div>
          
          {/* 오른쪽 큰 박스 */}
          <div style={{
            border: '1px solid #699bf7',
            borderRadius: '12px',
            backgroundColor: '#fff',
            flex: '1', // 남은 영역 전체 차지
            height: '100%', // 부모 높이에 맞춤
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Ensure content doesn't overflow beyond border radius
          }}>
            {/* 박스 타이틀 영역 */}
            <div style={{
              borderBottom: '1px solid #699bf7',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#699bf7',
              color: '#fff',
              borderRadius: '12px 12px 0 0', // Add rounded corners only to the top
              overflow: 'hidden' // Ensure nothing shows outside the border radius
            }}>
              {/* 타이틀 텍스트 */}
              <div style={{
                color: '#fff',
                fontFamily: 'Pretendard-Medium, Helvetica',
                fontSize: '14px',
                fontWeight: '500'
              }}>초기 전략</div>
            </div>
            
            {/* 박스 컨텐츠 영역 */}
            <div style={{ 
              padding: '12px',
              flex: '1',
              overflow: 'auto',
              fontSize: '12px',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap'
            }}>
              {strategyData.strategy}
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return tabContents[activeTab] || null;
};

export default TabContent; 
 
 
 