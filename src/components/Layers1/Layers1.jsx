/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { VariantFilled4 } from "../../icons/VariantFilled4";
import { VariantOutline4 } from "../../icons/VariantOutline4";
import { VariantSharp4 } from "../../icons/VariantSharp4";
import "./style.css";

export const Layers1 = ({ variant }) => {
  return (
    <>
      {variant === "filled" && <VariantFilled4 className="instance-node-2" />}

      {variant === "sharp" && <VariantSharp4 className="instance-node-2" />}

      {variant === "outline" && <VariantOutline4 className="instance-node-2" />}
    </>
  );
};

Layers1.propTypes = {
  variant: PropTypes.oneOf(["sharp", "filled", "outline"]),
};
