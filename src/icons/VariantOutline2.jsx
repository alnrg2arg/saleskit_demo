import React from "react";

export const VariantOutline2 = ({ className, color = "#373737" }) => (
  <svg
    className={`variant-outline-2 ${className || ""}`}
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth="2" />
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="2" fill="none" />
  </svg>
); 