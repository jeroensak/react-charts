import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { ChartTooltipContext } from './tooltip-context';
import React from 'react';

export const TooltipComponent = ({ children }: { children: React.ReactNode }) => {
  const tooltip = useTooltip<any[]>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: false,
    scroll: true,
  });

  return (
    <div ref={containerRef}>
      <ChartTooltipContext.Provider value={{ ...tooltip, TooltipInPortal }}>{children}</ChartTooltipContext.Provider>
    </div>
  );
};
