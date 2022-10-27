import { AxisBottom, AxisLeft } from '@visx/axis';
import { ClipPath } from '@visx/clip-path';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Area, LinePath, Line } from '@visx/shape';
import React, { useId } from 'react';
import { useChartDimensions, withChartWrapper } from './with-chart-wrapper';
import { SafeSVG } from '../utils/safe-svg';
import { LinearGradient } from '@visx/gradient';
import dayjs from 'dayjs';
import { getMinMaxWithPadding } from '../utils/min-max';
import { TooltipCursor } from './tooltip/tooltip-cursor';
import { LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';

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

export interface LineChartProps<DataType> {
  lines: LineMeta[];
  data: DataType[];
  xAxisProps?: Partial<React.ComponentProps<typeof AxisBottom>>;
  yAxisProps?: Partial<React.ComponentProps<typeof AxisLeft>>;
  simplified?: boolean;
  hideTooltip?: boolean;
  hideLegend?: boolean;
  countScaleDomain?: [number, number];
  timeScaleDomain?: [Date, Date];
  numberFormatter?: (value: number | bigint) => string;
  axisColor?: string;
  textColor?: string;
  showXGridLines?: boolean;
  showYGridLines?: boolean;
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
  lines,
  data,
  xAxisProps,
  yAxisProps,
  simplified,
  hideTooltip,
  hideLegend,
  timeScaleDomain,
  countScaleDomain,
  numberFormatter,
  axisColor = '#07080A',
  textColor = '#07080A',
  showXGridLines,
  showYGridLines,
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

  const xGridValues = React.useMemo(() => {
    if (!showXGridLines) return null;

    return (xAxisProps?.tickValues || timeScale.ticks())
      .map((v) => timeScale(v) + offset.left)
      .filter((v) => v !== offset.left && v !== outerChartWidth);
  }, [showXGridLines, timeScale, offset.left, outerChartWidth]);

  const yGridValues = React.useMemo(() => {
    if (!showYGridLines) return null;

    return (yAxisProps?.tickValues || countScale.ticks())
      .map((v) => countScale(v))
      .filter((v) => v !== 0 && v !== innerChartHeight);
  }, [showYGridLines, countScale, offset.left, outerChartWidth]);

  const ordinalColorScale = scaleOrdinal({
    domain: lines.map((l) => l.label),
    range: lines.map((l) => l.color),
  });

  return (
    <div style={{ position: 'relative' }}>
      <SafeSVG width={outerChartWidth} height={outerChartHeight}>
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
          {!hideTooltip && <TooltipCursor data={dataForTooltip} xScale={timeScale} yScale={countScale} />}
        </Group>
        <AxisLeft
          left={offset.left}
          scale={countScale}
          {...defaultYAxisProps(axisColor, textColor)}
          tickValues={simplified ? countScale.domain() : defaultYAxisProps(axisColor, textColor).tickValues}
          tickStroke={simplified ? 'transparent' : defaultYAxisProps(axisColor, textColor).tickStroke}
          tickFormat={numberFormatter}
          {...yAxisProps}
        />
        <AxisBottom
          top={innerChartHeight}
          left={offset.left}
          scale={timeScale}
          {...defaultXAxisProps(axisColor, textColor)}
          tickValues={simplified ? timeScale.domain() : defaultXAxisProps(axisColor, textColor).tickValues}
          tickStroke={simplified ? 'transparent' : defaultXAxisProps(axisColor, textColor).tickStroke}
          {...xAxisProps}
        />
      </SafeSVG>
      {!hideLegend && (
        <div style={{ paddingLeft: offset.left }}>
          <LegendOrdinal scale={ordinalColorScale} direction="row" labelMargin="0 20px 0 0" />
        </div>
      )}
    </div>
  );
};

export const LineChart = withChartWrapper(LineChartBase);
