/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { VariantFilled9 } from "../../icons/VariantFilled9";
import { VariantOutline9 } from "../../icons/VariantOutline9";
import { VariantSharp9 } from "../../icons/VariantSharp9";
import "./style.css";

export const Search = ({ variant }) => {
  return (
    <>
      {variant === "filled" && <VariantFilled9 className="instance-node" />}

      {variant === "outline" && <VariantOutline9 className="instance-node" />}

      {variant === "sharp" && <VariantSharp9 className="instance-node" />}
    </>
  );
};

Search.propTypes = {
  variant: PropTypes.oneOf(["sharp", "filled", "outline"]),
};
