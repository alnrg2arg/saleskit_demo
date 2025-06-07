/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

export const IconEllipsis = ({
  className,
  elementClassName,
  elementClassNameOverride,
  divClassName,
}) => {
  return (
    <div className={`icon-ellipsis ${className}`}>
      <div className={`element ${elementClassName}`} />

      <div className={`element-2 ${elementClassNameOverride}`} />

      <div className={`element-3 ${divClassName}`} />
    </div>
  );
};
