/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { VariantFilled14 } from "../../icons/VariantFilled14";
import { VariantOutline14 } from "../../icons/VariantOutline14";
import { VariantSharp14 } from "../../icons/VariantSharp14";
import "./style.css";

export const BarChart = ({ variant }) => {
  return (
    <>
      {variant === "filled" && <VariantFilled14 className="instance-node-2" />}

      {variant === "outline" && (
        <VariantOutline14 className="instance-node-2" />
      )}

      {variant === "sharp" && <VariantSharp14 className="instance-node-2" />}
    </>
  );
};

BarChart.propTypes = {
  variant: PropTypes.oneOf(["sharp", "filled", "outline"]),
};
