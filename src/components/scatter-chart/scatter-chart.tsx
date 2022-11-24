import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Line } from '@visx/shape';
import React, { useId } from 'react';
import { useChartDimensions, withChartWrapper } from '../with-chart-wrapper';
import { SafeSVG } from '../../utils/safe-svg';
import { Axes, ExternalAxesProps } from '../axes';
import { GeneralChartProps } from '../../chart.interface';
import { useXGridValues, useYGridValues } from '../../utils/use-grid-values';
import { useChartTooltip } from '../tooltip/tooltip-context';

export interface DataType {
  x: number;
  y: number;
  content?: string;
  tooltipData?: any;
}

export interface LineChartProps extends ExternalAxesProps, GeneralChartProps {
  data: DataType[];
  showXGridLines?: boolean;
  xScaleDomain: [number, number];
  yScaleDomain: [number, number];
  showXCenterGridLine?: boolean;
  showYCenterGridLine?: boolean;
}

const ScatterChartBase = ({
  data,
  xAxisProps,
  yAxisProps,
  hideTooltip,
  xScaleDomain,
  yScaleDomain,
  axisColor = '#07080A',
  showXGridLines,
  showYGridLines,
  showXCenterGridLine,
  showYCenterGridLine,
  ...restProps
}: Omit<LineChartProps, 'data'> & { data: DataType[] }) => {
  const id = useId();
  const { offset, innerChartWidth, innerChartHeight, outerChartHeight, outerChartWidth } = useChartDimensions();
  const { showTooltip, hideTooltip: stopShowingTooltip } = useChartTooltip();

  const yScale = React.useMemo(
    () => scaleLinear({ domain: yScaleDomain, range: [innerChartHeight, 0] }),
    [innerChartHeight, yScaleDomain]
  );

  const xScale = React.useMemo(
    () =>
      scaleLinear({
        domain: xScaleDomain,
        range: [0, innerChartWidth],
      }),
    [innerChartWidth, xScaleDomain]
  );

  const xGridValues = useXGridValues(
    !!showXGridLines,
    xAxisProps?.tickValues || xScale.ticks(),
    xScale,
    offset.left,
    outerChartWidth
  );

  const yGridValues = useYGridValues(
    !!showYGridLines,
    yAxisProps?.tickValues || yScale.ticks(),
    yScale,
    innerChartHeight
  );

  const dataForChart = React.useMemo(() => {
    return data.reduce((acc, curr) => {
      const index = acc.findIndex((a) => a.x === curr.x && a.y === curr.y);
      if (index < 0) {
        acc.push({
          x: curr.x,
          y: curr.y,
          content: curr.content ? [curr.content] : [''],
          tooltipData: curr.tooltipData ? [curr.tooltipData] : [''],
        });
      } else {
        acc[index].content.push(curr.content || '');
        acc[index].tooltipData.push(curr.tooltipData || null);
      }

      return acc;
    }, [] as { x: number; y: number; content: string[]; tooltipData: any[] }[]);
  }, []);

  const setTooltipData = React.useCallback((cx: number, cy: number, tooltipData: any) => {
    showTooltip({
      tooltipTop: cy,
      tooltipLeft: cx,
      tooltipData: [{ valueX: 0, x: 0, y: 0, color: 'yellow', label: 'label', valueY: 0, index: 0, tooltipData }] as any[],
    });
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <SafeSVG width={outerChartWidth} height={outerChartHeight}>
        <linearGradient
          id={`grad-${id}`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={innerChartWidth}
          y1={innerChartHeight}
          y2={0}
          gradientTransform="rotate(0)">
          <stop offset="0%" stop-color="#0BCB74" stop-opacity="1" />
          <stop offset="20%" stop-color="#0BCB74" stop-opacity="1" />
          <stop offset="40%" stop-color="#F8B633" stop-opacity="1" />
          <stop offset="60%" stop-color="#F8B633" stop-opacity="1" />
          <stop offset="80%" stop-color="#FF5556" stop-opacity="1" />
          <stop offset="100%" stop-color="#FF5556" stop-opacity="1" />
        </linearGradient>
        {xGridValues?.map((value, index) => (
          <Line
            key={index}
            x1={value}
            x2={value}
            y1={0}
            y2={innerChartHeight}
            stroke={`${axisColor}44`}
            strokeWidth={1}
          />
        ))}

        {showXCenterGridLine && (
          <Line
            x1={innerChartWidth / 2 + offset.left}
            x2={innerChartWidth / 2 + offset.left}
            y1={0}
            y2={innerChartHeight}
            stroke={`${axisColor}44`}
            strokeWidth={1}
          />
        )}

        {showYCenterGridLine && (
          <Line
            x1={offset.left}
            x2={innerChartWidth + offset.left}
            y1={innerChartHeight / 2}
            y2={innerChartHeight / 2}
            stroke={`${axisColor}44`}
            strokeWidth={1}
          />
        )}

        {yGridValues?.map((value, index) => (
          <Line
            key={index}
            x1={offset.left}
            x2={outerChartWidth}
            y1={value}
            y2={value}
            stroke={`${axisColor}44`}
            strokeWidth={1}
          />
        ))}
        <Group width={innerChartWidth} height={innerChartHeight} left={offset.left}>
          {dataForChart.map((entry) => {
            console.log('entry', entry)
            return (
              <>
                {entry.content.map((content, i) => (
                  <React.Fragment key={i}>
                    <circle
                      cx={xScale(entry.x) + i * 5}
                      cy={yScale(entry.y)}
                      className="scatter-charts__circle"
                      r="20px"
                      fill={`url(#grad-${id})`}
                      strokeWidth="1px"
                      stroke="white"
                      onPointerEnter={() =>
                        entry.tooltipData[i]
                          ? setTooltipData(xScale(entry.x) + i * 5, yScale(entry.y) - 24, entry.tooltipData[i])
                          : undefined
                      }
                      onPointerLeave={() => stopShowingTooltip()}
                    />
                    <text
                      x={xScale(entry.x) + i * 5}
                      y={yScale(entry.y)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ transform: 'translate(1px, -1px)', pointerEvents: 'none' }}>
                      {content}
                    </text>
                  </React.Fragment>
                ))}
              </>
            );
          })}
        </Group>
        <Axes
          xAxisScale={xScale}
          yAxisScale={yScale}
          offsetLeft={offset.left}
          xAxisTopOffset={innerChartHeight}
          xAxisProps={xAxisProps}
          yAxisProps={yAxisProps}
          axisColor={axisColor}
          numberFormatter={restProps.numberFormatter}
          simplified={restProps.simplified}
          textColor={restProps.textColor}
        />
      </SafeSVG>
    </div>
  );
};

export const ScatterChart = withChartWrapper(ScatterChartBase);
