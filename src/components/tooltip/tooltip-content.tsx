import dayjs from 'dayjs';
import { useChartDimensions } from '../with-chart-wrapper';
// import { TooltipDataEntry } from '../chart-types';
import { useChartTooltip } from './tooltip-context';
import React from 'react';

export interface TooltipContentProps {
  tooltipContent?: (tooltipData: any[]) => React.ReactNode;
  tooltipXOffset?: number;
  tooltipTitle?: (tooltipData: any) => string | JSX.Element;
}

const TooltipInPortalContent = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // run this every render as we cannot use any hooks for this.
  // This checks of the far right of the tooltip is outside of the windows view.
  const isOutOfBoundsRight = Boolean(
    tooltipRef.current && tooltipRef.current.getBoundingClientRect().right >= window.innerWidth
  );

  const isOutOfBoundsLeft = Boolean(
    tooltipRef.current && tooltipRef.current.getBoundingClientRect().left - (tooltipRef.current.clientWidth / 2) < 0
  );

  React.useEffect(() => {
    if (!tooltipRef.current) return;

    if (isOutOfBoundsRight) tooltipRef.current.classList.add('out-of-bounds--right');
    else tooltipRef.current.classList.remove('out-of-bounds--right');

    if (isOutOfBoundsLeft) tooltipRef.current.classList.add('out-of-bounds--left');
    else tooltipRef.current.classList.remove('out-of-bounds--left');
  }, [isOutOfBoundsRight, isOutOfBoundsLeft]);

  return (
    // center the div at the same x as the tooltip (centered above the hovered data entry)
    <div ref={tooltipRef} style={{ transform: 'translateX(calc(-50% - 1px))' }}>
      {children}
    </div>
  );
};

/**
 * Chart tooltip content. This element should be rendered
 * OUTSIDE the SVG tag.
 */
export const TooltipContent = ({ tooltipContent, tooltipXOffset, tooltipTitle }: TooltipContentProps) => {
  const { offset } = useChartDimensions();
  const { tooltipData, tooltipTop = 0, tooltipLeft = 0, tooltipOpen, TooltipInPortal } = useChartTooltip();
  if (!tooltipOpen || !tooltipData) return null;

  return (
    <TooltipInPortal
      detectBounds={false}
      applyPositionStyle
      style={{ zIndex: 10, pointerEvents: 'none' }}
      top={tooltipTop - 10}
      left={tooltipLeft + offset.left}
      offsetLeft={tooltipXOffset ?? 0}>
      <TooltipInPortalContent>
        <div className="react-charts__tooltip-content">
          {/* If custom tooltipContent function is provided, use this to render the tooltip */}
          {tooltipContent && tooltipContent(tooltipData)}
          {/* If not, render the default tooltip 👇 */}
          {!tooltipContent && (
            <>
              {tooltipTitle ? (
                <span className="react-charts__tooltip-title">hello</span>
              ) : (
                <>
                  {/* If valueX is a date, by default render this as the date of the tooltip. */}
                  {tooltipData[0] && (tooltipData[0].valueX as any) instanceof Date && (
                    <span className="react-charts__tooltip-title">
                      {dayjs(tooltipData[0].valueX).format('DD MMMM YYYY')}
                    </span>
                  )}
                </>
              )}
              <TooltipDataTable tooltipData={tooltipData} /*yValueFormatter={formatNumber}*/ />
            </>
          )}
        </div>
      </TooltipInPortalContent>
    </TooltipInPortal>
  );
};

interface TooltipDataTableProps {
  tooltipData: { valueY: number; label: string; color: string }[];
  /**
   * If this method is provided, it will be used to render the Y value for each line.
   * The value of the y-axis will be passed, and a value to render in the tooltip
   * is expected as return value.
   */
  yValueFormatter?: (value: number) => string | number;
}

const TooltipDataTable = ({ tooltipData, yValueFormatter }: TooltipDataTableProps) => (
  <table className="react-charts__tooltip__table">
    <tbody>
      {tooltipData.map((line) => {
        let formattedValue = yValueFormatter ? yValueFormatter(line.valueY) : line.valueY;
        // if (typeof formattedValue === 'number') formattedValue = formatNumber(formattedValue);

        if (!line.valueY || !formattedValue) return null;
        return (
          <tr key={line.label}>
            <td aria-hidden>
              <svg width={16} height={16} className="react-charts__tooltip__table__element-color">
                <rect fill={line.color} width={16} height={16}></rect>
              </svg>
            </td>
            <td>{line.label}</td>
            <td>{formattedValue}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
