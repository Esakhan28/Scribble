import React from "react";

import { Tooltip as NeetoUITooltip } from "neetoui";

const Tooltip = ({ disabled, children, ...TooltipProps }) => {
  if (disabled) {
    return (
      <NeetoUITooltip {...TooltipProps}>
        <div>{children}</div>
      </NeetoUITooltip>
    );
  }

  return children;
};

export default Tooltip;
