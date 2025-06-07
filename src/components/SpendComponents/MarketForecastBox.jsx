import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

// 별도의 MarketForecastBox 컴포넌트
const MarketForecastBox = ({ marketData }) => {
  if (!marketData) {
    return (
      <div style={{ padding: '15px', color: '#666', fontSize: '14px' }}>
        원자재에 대한 시세 전망 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  // 공통 콘텐츠 스타일
  const contentStyle = {
    padding: '10px 15px',
    fontSize: '14px',
    lineHeight: '1.6',
  };

  return (
    <div style={{ height: '262px' }}>
      <Scrollbars
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        universal={true}
        renderThumbVertical={({ style, ...props }) => (
          <div
            {...props}
            style={{
              ...style,
              backgroundColor: '#699bf7',
              borderRadius: '4px',
              width: '6px'
            }}
          />
        )}
      >
        <div style={contentStyle}>
          {/* Market forecast summary */}
          {marketData.summary && (
            <div style={{ marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
              {marketData.summary}
            </div>
          )}
          
          {/* Market forecast details */}
          {marketData.demandSupplyIssue && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#154ECC' }}>
                수요/공급 이슈
              </div>
              <div>{marketData.demandSupplyIssue}</div>
            </div>
          )}
          
          {marketData.domesticSupplyLimit && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#154ECC' }}>
                국내 공급 및 수입 구조의 한계
              </div>
              <div>{marketData.domesticSupplyLimit}</div>
            </div>
          )}
          
          {marketData.regionalSituation && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#154ECC' }}>
                지역별 상황 및 기타 변수
              </div>
              <div>{marketData.regionalSituation}</div>
            </div>
          )}
          
          {marketData.competitionIntensity && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#154ECC' }}>
                경쟁 강도: 주요 수출국 및 가격 경쟁력
              </div>
              <div>{marketData.competitionIntensity}</div>
            </div>
          )}
          
          {marketData.technicalDevelopment && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#154ECC' }}>
                기술개발 현황
              </div>
              <div>{marketData.technicalDevelopment}</div>
            </div>
          )}
        </div>
      </Scrollbars>
    </div>
  );
};

export default MarketForecastBox; 
 
 
 
 
 
 
 