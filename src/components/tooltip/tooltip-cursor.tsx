import { AxisScale } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Line } from '@visx/shape';
import { bisector } from 'd3-array';
import throttle from 'lodash.throttle';
import React from 'react';
import { useChartDimensions } from '../with-chart-wrapper';
import { useChartTooltip } from './tooltip-context';

/**
 * This component renders a "cursor" inside the SVG showing a line where the cursor
 * is moving and dots on top of the active lines.
 * It also renders a rect tangle used as hit area for the mouse events.
 */
export const TooltipCursor = ({
  invisibleCursor,
  tooltipXOffset = 0,
  lineWidth = 1,
  data,
  xScale,
  yScale,
  translateX = 0,
  translateY = 0,
}: {
  invisibleCursor?: boolean;
  tooltipXOffset?: number;
  lineWidth?: number;
  data: { date: Date };
  xScale: AxisScale;
  yScale: AxisScale;
  translateX?: number;
  translateY?: number;
}) => {
  const { offset, innerChartHeight, innerChartWidth } = useChartDimensions();
  const { showTooltip, tooltipData, tooltipLeft = 0, hideTooltip, tooltipOpen } = useChartTooltip();
  const cursorOverChart = React.useRef(false);

  const handleTooltip = React.useMemo(
    () =>
      throttle((event: React.PointerEvent<SVGRectElement>) => {
        if (!xScale || !yScale || !cursorOverChart.current) return;
        const { x } = localPoint(event) || { x: 0 };
        // Corrected x with offset of chart.
        const correctedX = x - offset.left;
        // Depending in the axis type we need to get the xvalue in a different way.
        let xValueForLocalPoint: unknown = null;

        const isLineChart = 'invert' in xScale;
        const isBarChart = 'step' in xScale;

        // If invert property is on xScale, getting the value is easy.
        if (isLineChart) {
          xValueForLocalPoint = xScale.invert(correctedX);
        }

        // If the 'step' property is in the scale, it is a bar element.
        if (isBarChart) {
          const step = xScale.step();
          let bar = Math.round((correctedX + xScale.padding() * step) / step);
          if (bar === 0) bar = 1; // correct for the margin left to the first bar
          xValueForLocalPoint = xScale.domain()[bar - 1];
        }

        /**
         * There might be scales that require a different way of getting the xValue
         * for the mouse cursor. If so, the below error will appear, and we need to
         * add this scale.
         */
        if (xValueForLocalPoint === null) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`
        🚨 🚨 Tooltip could not be rendered for this chart. You are probably using a type of scale
        which we haven't implemented yet. See tooltip-cursor.tsx.
        `);
          }
          return;
        }

        const tooltipDataPoints = Object.keys(data)
          .map((dataKey) => {
            // @ts-ignore
            const chartElement = data[dataKey]; // todo: tsignore
            if (!chartElement) return null;
            let nearestIndex = 0;

            if (isBarChart) {
              nearestIndex = chartElement.data.findIndex(
                (entry: any) => entry?.[chartElement.xAccessor] === xValueForLocalPoint
              );
              if (nearestIndex === -1) nearestIndex = chartElement.data.length - 1;
            }

            if (isLineChart) {
              const bisectX = bisector((item: { [key: string]: any }) => item[chartElement.xAccessor]).center;
              nearestIndex = bisectX(chartElement.data, xValueForLocalPoint);
            }

            const dataPoint = chartElement.data[nearestIndex];
            // Creates a TooltipDataEntry for each chartElement, passed onto the tooltipdata
            // in the tooltip context.
            return {
              x:
                ((typeof chartElement.x === 'function'
                  ? chartElement.x(dataPoint, nearestIndex, chartElement.data)
                  : chartElement.x) || 0) + translateX,
              y:
                ((typeof chartElement.y === 'function'
                  ? chartElement.y(dataPoint, nearestIndex, chartElement.data)
                  : chartElement.y) || 0) + translateY,
              valueX: dataPoint?.[chartElement.xAccessor],
              valueY: dataPoint?.[chartElement.yAccessor],
              color: chartElement.color,
              label: chartElement.label,
              index: nearestIndex,
              inactive: chartElement.inactive,
            };
          })
          // Remove any null values, which are the result of lines that somehow didn't have any data.
          // This is merely a fail safe and actually should not occur.
          .filter((t) => t !== null)
          // Filter out all "inactive" elements, we don't want to show these in the tooltip.
          .filter((t) => !t?.inactive);

        if (!tooltipDataPoints.length) return;

        const tooltipLeft = tooltipDataPoints[0]?.x ?? 0;

        // prevent the tooltip from going outside of the chart
        if (tooltipLeft < 0 || tooltipLeft > innerChartWidth) return;

        showTooltip({
          // @ts-ignore
          tooltipData: tooltipDataPoints,
          tooltipLeft,
          tooltipTop: 0,
        });
      }, 100),
    [xScale, yScale, offset.left, data, innerChartWidth, showTooltip, translateX, translateY]
  );

  const onMouseEnter = (event: React.PointerEvent<SVGRectElement>) => {
    cursorOverChart.current = true;
    handleTooltip(event);
  };

  const onMouseLeave = () => {
    cursorOverChart.current = false;
    hideTooltip();
  };

  return (
    <>
      {tooltipOpen && tooltipData && (
        <>
          <Line
            from={{ y: 0, x: tooltipLeft + tooltipXOffset }}
            to={{ y: innerChartHeight, x: tooltipLeft + tooltipXOffset }}
            stroke={'gray'} //todo: variable
            strokeWidth={lineWidth}
          />
          {!invisibleCursor &&
            tooltipData
              // Filter inactive lines
              .filter((line) => !line.inactive)
              // Filter lines without a value
              .filter((line) => line.valueY)
              .map((line) => (
                <React.Fragment key={line.label}>
                  <circle
                    cx={line.x}
                    cy={line.y}
                    r={4}
                    stroke={'white'}
                    strokeWidth={1}
                    width={6}
                    height={6}
                    fill={line.color}
                  />
                </React.Fragment>
              ))}
        </>
      )}
      <rect
        y={0}
        x={0}
        width={innerChartWidth}
        height={innerChartHeight}
        fillOpacity="0"
        onPointerEnter={onMouseEnter}
        onPointerMove={handleTooltip}
        onPointerLeave={onMouseLeave}
      />
    </>
  );
};
