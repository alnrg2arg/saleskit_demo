/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { VariantFilled12 } from "../../icons/VariantFilled12";
import { VariantOutline12 } from "../../icons/VariantOutline12";
import { VariantSharp12 } from "../../icons/VariantSharp12";
import "./style.css";

export const Layers = ({ variant }) => {
  return (
    <>
      {variant === "filled" && <VariantFilled12 className="instance-node-3" />}

      {variant === "sharp" && <VariantSharp12 className="instance-node-3" />}

      {variant === "outline" && (
        <VariantOutline12 className="instance-node-3" />
      )}
    </>
  );
};

Layers.propTypes = {
  variant: PropTypes.oneOf(["sharp", "filled", "outline"]),
};
