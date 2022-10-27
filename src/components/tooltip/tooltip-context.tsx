import { UseTooltipParams } from '@visx/tooltip/lib/hooks/useTooltip';
import { TooltipInPortalProps } from '@visx/tooltip/lib/hooks/useTooltipInPortal';
import { useContext, createContext } from 'react';

export interface TooltipDataEntry {
  x: number;
  y: number;
  valueX: number | Date;
  valueY: number;
  color: string;
  label: string;
  index: number;
  inactive?: boolean;
}

export type ChartTooltipContextType = UseTooltipParams<TooltipDataEntry[]> & {
  TooltipInPortal: React.FC<TooltipInPortalProps>;
};
export const ChartTooltipContext = createContext<ChartTooltipContextType>({} as ChartTooltipContextType);
export const useChartTooltip = () => useContext(ChartTooltipContext);
ChartTooltipContext.displayName = 'ChartTooltipContext';
