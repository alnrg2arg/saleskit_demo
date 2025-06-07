/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { VariantFilled3 } from "../../icons/VariantFilled3";
import { VariantOutline3 } from "../../icons/VariantOutline3";
import { VariantSharp3 } from "../../icons/VariantSharp3";
import "./style.css";

export const Receipt = ({ variant }) => {
  return (
    <>
      {variant === "filled" && <VariantFilled3 className="instance-node-3" />}

      {variant === "outline" && (
        <VariantOutline3 className="instance-node-3" color="#373737" />
      )}

      {variant === "sharp" && <VariantSharp3 className="instance-node-3" />}
    </>
  );
};

Receipt.propTypes = {
  variant: PropTypes.oneOf(["sharp", "filled", "outline"]),
};
