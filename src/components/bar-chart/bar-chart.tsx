import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import React, { ReactText, useMemo } from 'react';
import { TextWithBackground } from './text-with-background';
import { useChartDimensions, withChartWrapper } from '../with-chart-wrapper';
import { BarGroup } from '@visx/shape';
import { TooltipCursor } from '../tooltip/tooltip-cursor';
import { highestValue } from '../../utils/min-max';
import { SafeSVG } from '../../utils/safe-svg';
import { Axes, ExternalAxesProps } from '../axes';
import { Legend } from '../legend';

interface BarchartProps<DataType> extends ExternalAxesProps {
  data?: DataType[];
  bars: {
    accessor: string;
    color: string;
    label: string;
  }[];
  axisColor?: string;
  textColor?: string;
  hideLegend?: boolean;
  hideBarText?: boolean;
  barTextColor?: string;
}

const barPadding = 0.4;

export interface RequiredDataProperties {
  [key: string]: any;
  valueX: number;
}

const BarChartBase = <DataType extends RequiredDataProperties>({
  data,
  xAxisProps,
  yAxisProps,
  bars,
  numberFormatter,
  axisColor,
  hideLegend,
  hideBarText,
  barTextColor,
  ...restProps
}: Omit<BarchartProps<DataType>, 'data'> & { data: DataType[] }) => {
  const { offset, innerChartWidth, innerChartHeight, outerChartHeight, outerChartWidth } = useChartDimensions();
  const [barWidth, setBarWidth] = React.useState(0);

  const yMax = useMemo(() => highestValue(data, ...bars.map((a) => a.accessor)), [data, bars]);
  const xAxisScale = useMemo(
    () =>
      scaleBand<number>({
        domain: data.map((d) => d.valueX),
        padding: barPadding,
        range: [0, innerChartWidth],
      }),
    [data, innerChartWidth]
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

  const countScale = useMemo(
    () => scaleLinear({ domain: [0, yMax], range: [innerChartHeight, 0] }),
    [innerChartHeight, yMax]
  );

  const dataForTooltip = React.useMemo(() => {
    return bars.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.accessor]: {
          ...curr,
          data: data.map((a) => ({
            value: a[curr.accessor],
            time: a.valueX,
          })),
          xAccessor: 'time',
          yAccessor: 'value',
          x: (d: DataType) => xAxisScale(d.time) ?? 0,
          y: (d: DataType) => countScale(d.value || 0),
        },
      };
    }, {} as any);
  }, [bars, data, xAxisScale, countScale]);

  return (
    <div style={{ position: 'relative' }}>
      <SafeSVG width={outerChartWidth} height={outerChartHeight}>
        <Group left={offset.left} top={offset.top} width={innerChartWidth} height={innerChartHeight}>
          <BarGroup
            data={data}
            keys={bars.map((a) => a.accessor)}
            height={innerChartHeight}
            x0={(d) => d.valueX}
            x0Scale={xAxisScale}
            x1Scale={accessorScale}
            yScale={countScale}
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
                            transform: 'translateY(0.5rem)',
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
          <TooltipCursor
            translateX={(barWidth * bars.length) / 2}
            data={dataForTooltip}
            xScale={xAxisScale}
            yScale={countScale}
            invisibleCursor
          />
        </Group>
        <Axes
          xAxisScale={xAxisScale}
          yAxisScale={countScale}
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
