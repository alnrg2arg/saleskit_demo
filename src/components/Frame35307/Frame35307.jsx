/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

export const Frame35307 = ({ 
  className, 
  supplierName, 
  supplierSpend, 
  lastDate, 
  orderCount = 0, 
  orderQuantity = 0, 
  orderUnit = "장",
  lastPrice = 0
}) => {
  // Format order quantity with thousands separator
  const formattedQuantity = orderQuantity.toLocaleString();
  
  // Format the last price with thousands separator
  const formattedPrice = lastPrice.toLocaleString();
  
  // Dynamically calculate font size based on length
  const getFontSize = (text, unit) => {
    const totalLength = text.length + unit.length;
    if (totalLength > 12) return 11;
    if (totalLength > 10) return 12;
    if (totalLength > 8) return 13;
    if (totalLength > 6) return 14;
    return 16;
  };
  
  const quantityFontSize = getFontSize(formattedQuantity, orderUnit);
  const priceFontSize = getFontSize(formattedPrice, "원");
  
  return (
    <div className={`frame-35307 ${className}`}>
      <div className="overlap-7">
        <div className="frame-10">
          <div className="text-wrapper-25">{supplierName}</div>

          <div className="frame-11">
            <div className="overlap-group-4" style={{ position: 'relative' }}>
              <div className="text-wrapper-26">종전가</div>

              <div className="rectangle-10" />

              <div 
                className="text-wrapper-27"
                style={{
                  fontSize: `${priceFontSize}px`,
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 2,
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: '0 4px',
                  fontWeight: 500
                }}
              >
                {formattedPrice} 원
              </div>
            </div>
          </div>

          <div className="text-wrapper-28">최종 거래 {lastDate}</div>

          <div className="frame-12">
            <div className="overlap-group-4" style={{ position: 'relative' }}>
              <div className="text-wrapper-26">발주 수량</div>

              <div className="rectangle-11" />

              <div 
                className="text-wrapper-29" 
                style={{
                  fontSize: `${quantityFontSize}px`,
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 2,
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: '0 4px',
                  fontWeight: 500
                }}
              >
                {formattedQuantity} {orderUnit}
              </div>
            </div>
          </div>

          <div className="frame-13">
            <div className="overlap-group-4">
              <div className="rectangle-12" />

              <div className="text-wrapper-26">발주 횟수</div>

              <div className="text-wrapper-30">{orderCount} 회</div>
            </div>
          </div>

          <div className="overlap-8">
            <div className="text-wrapper-31">{supplierSpend}</div>

            <div className="text-wrapper-32">억원</div>
          </div>
        </div>
      </div>
    </div>
  );
};
