import { createElement } from "react";

const IconTile = ({ label = "", size = "medium", primaryColor = "currentColor" }) =>
  createElement(
    "span",
    {
      role: "img",
      "aria-label": label,
      style: {
        display: "inline-flex",
        width: size === "small" ? 16 : 24,
        height: size === "small" ? 16 : 24,
        background: "rgba(0,0,0,0.05)",
        borderRadius: 4,
        color: primaryColor,
      },
    },
    "⬜"
  );

export default IconTile;
export { IconTile };
