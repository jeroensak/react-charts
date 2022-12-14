import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import React, { ReactText, useMemo } from 'react';
import { TextWithBackground } from './text-with-background';
import { useChartDimensions, withChartWrapper } from '../with-chart-wrapper';
import { BarGroup, Line } from '@visx/shape';
import { TooltipCursor } from '../tooltip/tooltip-cursor';
import { getMinMax } from '../../utils/min-max';
import { SafeSVG } from '../../utils/safe-svg';
import { Axes, ExternalAxesProps } from '../axes';
import { Legend } from '../legend';
import { GeneralChartProps } from '../../chart.interface';
import { useYGridValues } from '../../utils/use-grid-values';

interface BarchartProps<DataType> extends ExternalAxesProps, GeneralChartProps {
  data?: DataType[];
  bars: {
    accessor: string;
    color: string;
    label: string;
  }[];
  hideBarText?: boolean;
  barTextColor?: string;
  xAccessor?: string;
  barPadding?: number;
}

export interface RequiredDataProperties {
  [key: string]: any;
}

const BarChartBase = <DataType extends RequiredDataProperties>({
  data,
  xAxisProps,
  yAxisProps,
  bars,
  barPadding = 0.4,
  numberFormatter,
  axisColor = '#07080A',
  hideLegend,
  hideBarText,
  hideTooltip,
  barTextColor,
  xAccessor = 'valueX',
  xScaleDomain,
  yScaleDomain,
  showYGridLines,
  chartYDomainPadding = 0,
  ...restProps
}: Omit<BarchartProps<DataType>, 'data'> & { data: DataType[] }) => {
  const { offset, innerChartWidth, innerChartHeight, outerChartHeight, outerChartWidth } = useChartDimensions();
  const [barWidth, setBarWidth] = React.useState(0);

  const { max: yMax } = React.useMemo(
    () => getMinMax(data, chartYDomainPadding, ...bars.map((a) => a.accessor)),
    [data, bars, chartYDomainPadding]
  );

  const xAxisScale = useMemo(
    () =>
      scaleBand<number | string | Date>({
        domain: xScaleDomain || data.map((d) => d[xAccessor]),
        padding: barPadding,
        range: [0, innerChartWidth],
      }),
    [data, innerChartWidth, xScaleDomain, xAccessor]
  );

  const { colorScale, accessorScale } = React.useMemo(
    () => ({
      colorScale: scaleOrdinal<ReactText, string>({
        domain: bars.map((a) => a.accessor),
        range: bars.map((a) => a.color),
      }),
      accessorScale: scaleBand<string>({
        domain: bars.map((a) => a.accessor),
        padding: 0,
        range: [0, xAxisScale.bandwidth()],
      }),
    }),
    [bars, xAxisScale]
  );

  const yAxisScale = useMemo(
    () => scaleLinear({ domain: yScaleDomain || [0, yMax], range: [innerChartHeight, 0] }),
    [innerChartHeight, yMax, yScaleDomain]
  );

  const dataForTooltip = React.useMemo(() => {
    return bars.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.accessor]: {
          ...curr,
          data: data.map((a) => ({
            value: a[curr.accessor],
            time: a[xAccessor],
          })),
          xAccessor: 'time',
          yAccessor: 'value',
          x: (d: DataType) => xAxisScale(d.time) ?? 0,
          y: (d: DataType) => yAxisScale(d.value || 0),
        },
      };
    }, {} as any);
  }, [bars, data, xAxisScale, yAxisScale, xAccessor]);

  const yGridValues = useYGridValues(
    !!showYGridLines,
    yAxisProps?.tickValues || yAxisScale.ticks(),
    yAxisScale,
    innerChartHeight
  );

  return (
    <div style={{ position: 'relative' }}>
      <SafeSVG width={outerChartWidth} height={outerChartHeight}>
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
        <Group left={offset.left} top={offset.top} width={innerChartWidth} height={innerChartHeight}>
          <BarGroup
            data={data}
            keys={bars.map((a) => a.accessor)}
            height={innerChartHeight}
            x0={(d) => d[xAccessor]}
            x0Scale={xAxisScale}
            x1Scale={accessorScale}
            yScale={yAxisScale}
            color={colorScale}>
            {(barGroups) => {
              setBarWidth(barGroups?.[0]?.bars?.[0]?.width || 0);
              return barGroups.map((barGroup) => (
                <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                  {barGroup.bars.map((bar) => (
                    <React.Fragment key={`bar-group-bar-${barGroup.index}-${bar.index}`}>
                      <rect
                        key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        fill={bar.color}
                        stroke="none"
                      />
                      {!hideBarText && (
                        <TextWithBackground
                          x={bar.x + bar.width / 2}
                          y={bar.y + bar.height / 2}
                          width={bar.width}
                          backgroundColor={bar.color}
                          fill={barTextColor || 'white'}
                          textAnchor="middle"
                          style={{
                            transform: 'translateY(5px)',
                          }}>
                          {numberFormatter ? numberFormatter(bar.value) : bar.value}
                        </TextWithBackground>
                      )}
                    </React.Fragment>
                  ))}
                </Group>
              ));
            }}
          </BarGroup>
          {!hideTooltip && (
            <TooltipCursor
              translateX={(barWidth * bars.length) / 2}
              data={dataForTooltip}
              xScale={xAxisScale}
              yScale={yAxisScale}
              invisibleCursor
            />
          )}
        </Group>
        <Axes
          xAxisScale={xAxisScale}
          yAxisScale={yAxisScale}
          offsetLeft={offset.left}
          xAxisTopOffset={innerChartHeight}
          xAxisProps={xAxisProps}
          yAxisProps={yAxisProps}
          axisColor={axisColor}
          numberFormatter={numberFormatter}
          simplified={restProps.simplified}
          textColor={restProps.textColor}
        />
      </SafeSVG>
      {!hideLegend && <Legend elements={bars} offsetLeft={offset.left} />}
    </div>
  );
};

export const BarChart = withChartWrapper(BarChartBase);
