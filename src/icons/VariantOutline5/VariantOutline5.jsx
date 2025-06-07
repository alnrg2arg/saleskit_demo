/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const VariantOutline5 = ({ color = "#373737", className }) => {
  return (
    <svg
      className={`variant-outline-5 ${className}`}
      fill="none"
      height="28"
      viewBox="0 0 28 28"
      width="28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M3.5 7.00766C3.5 6.52018 3.89518 6.125 4.38266 6.125H23.6173C24.1048 6.125 24.5 6.52018 24.5 7.00766V20.1173C24.5 20.6048 24.1048 21 23.6173 21H4.38266C3.89518 21 3.5 20.6048 3.5 20.1173V7.00766ZM4.38266 4.375C2.92868 4.375 1.75 5.55368 1.75 7.00766V20.1173C1.75 20.7928 2.00441 21.4089 2.42264 21.875H0.875C0.391751 21.875 0 22.2668 0 22.75C0 23.2332 0.391751 23.625 0.875 23.625H27.125C27.6082 23.625 28 23.2332 28 22.75C28 22.2668 27.6082 21.875 27.125 21.875H25.5774C25.9956 21.4089 26.25 20.7928 26.25 20.1173V7.00766C26.25 5.55368 25.0713 4.375 23.6173 4.375H4.38266Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
};

VariantOutline5.propTypes = {
  color: PropTypes.string,
};
