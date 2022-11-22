import { ClipPath } from '@visx/clip-path';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Area, LinePath, Line } from '@visx/shape';
import React, { useId } from 'react';
import { useChartDimensions, withChartWrapper } from './with-chart-wrapper';
import { SafeSVG } from '../utils/safe-svg';
import { LinearGradient } from '@visx/gradient';
import { getMinMax } from '../utils/min-max';
import { TooltipCursor } from './tooltip/tooltip-cursor';
import { Axes, ExternalAxesProps } from './axes';
import { Legend } from './legend';
import { GeneralChartProps } from '../chart.interface';
import { useXGridValues, useYGridValues } from '../utils/use-grid-values';

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

export interface LineChartProps<DataType> extends ExternalAxesProps, GeneralChartProps {
  lines: LineMeta[];
  data: DataType[];
  showXGridLines?: boolean;
}

const LineChartBase = <DataType extends RequiredDataProperties>({
  lines,
  data,
  xAxisProps,
  yAxisProps,
  hideTooltip,
  hideLegend,
  xScaleDomain,
  yScaleDomain,
  axisColor = '#07080A',
  showXGridLines,
  showYGridLines,
  chartYDomainPadding = 0,
  ...restProps
}: Omit<LineChartProps<DataType>, 'data'> & { data: DataType[] }) => {
  const id = useId();
  const { offset, innerChartWidth, innerChartHeight, outerChartHeight, outerChartWidth } = useChartDimensions();

  const { min: yMin, max: yMax } = React.useMemo(
    () => getMinMax(data, chartYDomainPadding, ...lines.map((a) => a.accessor)),
    [data, lines, chartYDomainPadding]
  );

  const countScale = React.useMemo(
    () => scaleLinear({ domain: yScaleDomain || [yMin, yMax], range: [innerChartHeight, 0] }),
    [innerChartHeight, yMax, yMin, yScaleDomain]
  );

  const timeScaleDomain = React.useMemo(
    () => (xScaleDomain as [Date, Date]) || (data?.length ? [data[0].date, data.at(-1)!.date] : []),
    [xScaleDomain, data]
  );

  const timeScale = React.useMemo(
    () =>
      scaleTime({
        domain: timeScaleDomain,
        range: [0, innerChartWidth],
      }),
    [innerChartWidth, xScaleDomain]
  );

  const dataForTooltip = React.useMemo(() => {
    return lines.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.accessor]: {
          ...curr,
          data: data.map((a) => ({
            value: a[curr.accessor],
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

  const xGridValues = useXGridValues(
    !!showXGridLines,
    xAxisProps?.tickValues || timeScale.ticks(),
    timeScale,
    offset.left,
    outerChartWidth
  );

  const yGridValues = useYGridValues(
    !!showYGridLines,
    yAxisProps?.tickValues || countScale.ticks(),
    countScale,
    innerChartHeight
  );

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
            let lineMinX = timeScale(timeScaleDomain[0]);
            lineMinX = lineMinX < 0 ? 0 : lineMinX;

            const lineMaxX = timeScale(timeScaleDomain[1]);

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
        <Axes
          xAxisScale={timeScale}
          yAxisScale={countScale}
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
      {!hideLegend && <Legend elements={lines} offsetLeft={offset.left} />}
    </div>
  );
};

export const LineChart = withChartWrapper(LineChartBase);
