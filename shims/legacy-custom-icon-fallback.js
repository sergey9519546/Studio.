import React from "react";

const LegacyCustomIconFallback = (props) =>
  React.createElement("span", {
    ...props,
    "aria-hidden": "true",
    style: { width: 16, height: 16, display: "inline-flex" },
  });

export default LegacyCustomIconFallback;
