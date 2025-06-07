/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React, { useState } from "react";
import "./style.css";

export const FrameWrapper = ({
  className,
  divClassName,
  text = "1",
  itemName = "아이템AAA",
  spend = "00.0억원",
  supplier = "공급업체AAA 외 9",
  material = "밀",
  hugeiconsAiContent = "/img/hugeicons-ai-content-generator-01.svg",
  onClick,
  style,
}) => {
  // 툴팁 상태
  const [showTooltip, setShowTooltip] = useState(false);

  // 주요 원자재 텍스트 자르기 및 툴팁
  let mainMaterialNode;
  if (material && material.length > 20) {
    mainMaterialNode = (
      <span className="item-name-tooltip">
        {material.slice(0, 20)}...<span className="tooltip-box">{material}</span>
      </span>
    );
  } else {
    mainMaterialNode = material;
  }

  return (
    <div
      className={`frame-wrapper ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: "relative", ...style }}
      onClick={onClick}
    >
      <div className="element-wrapper">
        <div className={`element-2 ${divClassName}`}>{text}</div>
      </div>

      <div className="frame-2">
        <div className="text-wrapper-4">{itemName}</div>

        <img
          className="img"
          alt="Hugeicons ai content"
          src={hugeiconsAiContent}
        />
      </div>

      <div className="group-2">
        <div className="frame-3">
          <div className="text-wrapper-5">구매 비용</div>

          <div className="text-wrapper-6">{spend}</div>
        </div>

        <div className="frame-4">
          <div className="text-wrapper-5">공급업체</div>

          <div className="text-wrapper-7">{supplier}</div>
        </div>

        <img className="line-2" alt="Line" src="/img/line-14.svg" />

        <div className="frame-5">
          <div className="text-wrapper-8">{mainMaterialNode}</div>

          <div className="text-wrapper-5">주요 원자재</div>
        </div>
      </div>
    </div>
  );
};

FrameWrapper.propTypes = {
  text: PropTypes.string,
  itemName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  spend: PropTypes.string,
  supplier: PropTypes.string,
  material: PropTypes.string,
  hugeiconsAiContent: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
};
