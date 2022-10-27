import { AxisBottom, AxisLeft } from '@visx/axis';
import { ClipPath } from '@visx/clip-path';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Area, LinePath } from '@visx/shape';
import React, { useId } from 'react';
import { useChartDimensions, withChartWrapper } from './with-chart-wrapper';
// import { TooltipCursor } from './tooltip/tooltip-cursor';
import { SafeSVG } from '../utils/safe-svg';
import { LinearGradient } from '@visx/gradient';
import dayjs from 'dayjs';
import { getMinMaxWithPadding } from '../utils/min-max';
import { TooltipCursor } from './tooltip/tooltip-cursor';

export interface RequiredDataProperties {
  [key: string]: any;
  date: Date;
}

export interface LineMeta {
  accessor: string;
  label: string;
  color: string;
  area?: string;
  dotted?: boolean;
}

interface LineChartProps<DataType> {
  timeScaleDomain?: [Date, Date];
  lines: LineMeta[];
  data?: DataType[];
  toggleLines?: true;
  xAxisProps?: Partial<React.ComponentProps<typeof AxisBottom>>;
  yAxisProps?: Partial<React.ComponentProps<typeof AxisLeft>>;
  hideLegend?: true;
  simplified?: true;
  hideTooltip?: true;
  countScaleDomain?: [number, number];
  numberFormatter?: (value: number | bigint) => string;
  axisColor?: string;
  textColor?: string;
}

const defaultXAxisProps: (
  axisColor?: string,
  textColor?: string
) => Partial<React.ComponentProps<typeof AxisBottom>> = (axisColor?: string, textColor?: string) => ({
  stroke: axisColor,
  tickStroke: axisColor,
  tickLength: 3,
  tickComponent: ({ formattedValue, ...props }) => (
    <text {...props} fontSize={12} transform="translate(-5)" fill={textColor}>
      {formattedValue}
    </text>
  ),
  tickFormat: (t) => dayjs(t).format('DD MMM'),
});

const defaultYAxisProps: (axisColor?: string, textColor?: string) => Partial<React.ComponentProps<typeof AxisLeft>> = (
  axisColor?: string,
  textColor?: string
) => ({
  stroke: axisColor,
  tickStroke: axisColor,
  tickLength: 3,
  numTicks: 4,
  tickComponent: ({ formattedValue, ...props }) => (
    <text {...props} fontSize={12} fill={textColor}>
      {formattedValue}
    </text>
  ),
});

const LineChartBase = <DataType extends RequiredDataProperties>({
  timeScaleDomain,
  lines,
  data,
  xAxisProps,
  yAxisProps,
  simplified,
  // hideTooltip,
  countScaleDomain,
  numberFormatter,
  axisColor,
  textColor,
}: Omit<LineChartProps<DataType>, 'data'> & { data: DataType[] }) => {
  const id = useId();
  const { offset, innerChartWidth, innerChartHeight, outerChartHeight, outerChartWidth } = useChartDimensions();

  const { min: yMin, max: yMax } = React.useMemo(
    () => getMinMaxWithPadding(data, ...lines.map((a) => a.accessor)),
    [data, lines]
  );

  const countScale = React.useMemo(
    () => scaleLinear({ domain: countScaleDomain || [yMin, yMax], range: [innerChartHeight, 0] }),
    [innerChartHeight, yMax, yMin, countScaleDomain]
  );

  const timeScale = React.useMemo(
    () =>
      scaleTime({
        domain: timeScaleDomain || data?.length ? [data[0].date, data.at(-1)!.date] : [],
        range: [0, innerChartWidth],
      }),
    [innerChartWidth, timeScaleDomain]
  );

  const dataForTooltip = React.useMemo(() => {
    return lines.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.accessor]: {
          ...curr,
          data: data.map((a) => ({
            value: typeof a[curr.accessor] === 'number' ? Math.round(a[curr.accessor]) : a[curr.accessor],
            time: a.date,
          })),
          xAccessor: 'time',
          yAccessor: 'value',
          x: (d: DataType) => timeScale(d.time) ?? 0,
          y: (d: DataType) => countScale(d.value || 0),
        },
      };
    }, {} as any);
  }, [lines, data, timeScale, countScale]);

  return (
    <div style={{ position: 'relative' }}>
      <SafeSVG width={outerChartWidth} height={outerChartHeight}>
        {lines.map((line) => (
          <LinearGradient
            key={line.accessor}
            id={`gradient-${line.accessor}-${id}`}
            from={line.color}
            to={line.color}
            fromOpacity={1}
            toOpacity={0}
          />
        ))}
        <Group width={innerChartWidth} height={innerChartHeight} left={offset.left}>
          {lines.map((line) => {
            let lineMinX = timeScale(data.find((entry) => entry[line.accessor] !== undefined)?.date || 0);
            lineMinX = lineMinX < 0 ? 0 : lineMinX;

            const lineMaxX = timeScale(
              [...data].reverse().find((entry) => entry[line.accessor] !== undefined)?.date || 0
            );

            return (
              <React.Fragment key={line.accessor}>
                <ClipPath id={`clippath-${id}-${line.accessor}`}>
                  <rect x={lineMinX > 0 ? lineMinX + 2 : 0} width={lineMaxX - lineMinX - 2} height={innerChartHeight} />
                </ClipPath>
                <LinePath
                  data={data.map((d) => ({
                    value: d[line.accessor],
                    time: d.date,
                  }))}
                  stroke={line.color}
                  strokeWidth={line.area ? 3 : 2}
                  strokeDasharray={line.dotted ? 5 : undefined}
                  x={(d) => timeScale(d.time) ?? 0}
                  y={(d) => countScale(d.value || 0)}
                  clipPath={`url(#clippath-${id}-${line.accessor})`}
                />
                {line.area && (
                  <Area
                    clipPath={`url(#clippath-${id}-${line.accessor})`}
                    data={data.map((d) => ({
                      value: d[line.accessor] || 0,
                      time: d.date,
                    }))}
                    fill={line.area}
                    opacity={1}
                    x={(d) => timeScale(d.time) ?? 0}
                    y0={(d) => countScale(d.value) ?? 0}
                    y1={innerChartHeight}
                  />
                )}
              </React.Fragment>
            );
          })}
          <TooltipCursor data={dataForTooltip} xScale={timeScale} yScale={countScale} />
        </Group>
        <AxisLeft
          left={offset.left}
          scale={countScale}
          {...defaultYAxisProps(axisColor, textColor)}
          tickValues={simplified ? [0, Math.floor(yMax)] : defaultYAxisProps(axisColor, textColor).tickValues}
          tickStroke={simplified ? 'transparent' : defaultYAxisProps(axisColor, textColor).tickStroke}
          tickFormat={numberFormatter}
          {...yAxisProps}
        />
        <AxisBottom
          top={innerChartHeight}
          left={offset.left}
          scale={timeScale}
          {...defaultXAxisProps(axisColor, textColor)}
          tickValues={[data[0].date, data[data.length - 1].date]}
          tickStroke={simplified ? 'transparent' : defaultXAxisProps(axisColor, textColor).tickStroke}
          {...xAxisProps}
        />
      </SafeSVG>
    </div>
  );
};

export const LineChart = withChartWrapper(LineChartBase);
