/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { VariantFilled6 } from "../../icons/VariantFilled6";
import { VariantOutline6 } from "../../icons/VariantOutline6";
import { VariantSharp6 } from "../../icons/VariantSharp6";
import "./style.css";

export const ConcreteComponentNode = ({ variant }) => {
  return (
    <>
      {variant === "filled" && <VariantFilled6 className="instance-node" />}

      {variant === "outline" && <VariantOutline6 className="instance-node" />}

      {variant === "sharp" && <VariantSharp6 className="instance-node" />}
    </>
  );
};

ConcreteComponentNode.propTypes = {
  variant: PropTypes.oneOf(["sharp", "filled", "outline"]),
};
