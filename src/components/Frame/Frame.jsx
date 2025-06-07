/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React, { useState } from "react";
import "./style.css";

export const Frame = ({
  className,
  divClassName,
  hugeiconsAiContent = "/img/hugeicons-ai-content-generator-01.svg",
  divClassNameOverride,
  text = "1",
  divClassName1,
  text1 = "공급업체AAA 외 9",
  divClassName2,
  text2 = "밀",
  text3 = "아이템AAA",
  spend = "00.0억원",
  onClick,
  style,
}) => {
  // 툴크 상태
  const [showTooltip, setShowTooltip] = useState(false);

  // 주요 원자재 텍스트 자르기 및 툴팁
  let mainMaterialNode;
  if (text2 && text2.length > 20) {
    mainMaterialNode = (
      <span className="item-name-tooltip">
        {text2.slice(0, 20)}...<span className="tooltip-box">{text2}</span>
      </span>
    );
  } else {
    mainMaterialNode = text2;
  }

  return (
    <div
      className={`frame ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: "relative", ...style }}
      onClick={onClick}
    >
      <div className="overlap-group">
        <div className={`element ${divClassNameOverride}`}>{text}</div>
      </div>

      <div className="group">
        <div className="div">
          <div className="text-wrapper">구매 비용</div>
          <div className="text-wrapper-2">{spend}</div>
        </div>

        <div className="div-2">
          <div className="text-wrapper">공급업체</div>
          <div className={`AAA ${divClassName1}`}>{text1}</div>
        </div>

        <img className="line" alt="Line" src="/img/line-14.svg" />

        <div className="div-3">
          <div className="text-wrapper-3">{mainMaterialNode}</div>
          <div className="text-wrapper">주요 원자재</div>
        </div>
      </div>

      <div className="div-4">
        <div className="AAA-2">{text3}</div>
        <img
          className="hugeicons-ai-content"
          alt="Hugeicons ai content"
          src={hugeiconsAiContent}
        />
      </div>
    </div>
  );
};

Frame.propTypes = {
  hugeiconsAiContent: PropTypes.string,
  text: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  spend: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
};
