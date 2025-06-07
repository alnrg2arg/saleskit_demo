/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const CaretDown = ({ color = "#B8C9EF", className }) => {
  return (
    <svg
      className={`caret-down ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M4.59311 8.90864L11.1453 16.5549C11.2509 16.6781 11.3819 16.7769 11.5293 16.8447C11.6768 16.9125 11.8371 16.9476 11.9994 16.9476C12.1616 16.9476 12.322 16.9125 12.4694 16.8447C12.6168 16.7769 12.7478 16.6781 12.8534 16.5549L19.4056 8.90864C20.0309 8.1788 19.5125 7.05145 18.5515 7.05145H5.4453C4.48436 7.05145 3.96592 8.1788 4.59311 8.90864Z"
        fill={color}
      />
    </svg>
  );
};

CaretDown.propTypes = {
  color: PropTypes.string,
};
