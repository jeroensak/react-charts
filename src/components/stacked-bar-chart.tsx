import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { SafeSVG } from '../utils/safe-svg';
import React, { ReactText } from 'react';
import { highestValue } from '../utils/min-max';
import { useChartDimensions, withChartWrapper } from './with-chart-wrapper';
import { BarStack } from '@visx/shape';
import { TooltipCursor } from './tooltip/tooltip-cursor';
import { BarGroupBar, StackKey } from '@visx/shape/lib/types';
import { Axes, ExternalAxesProps } from './axes';
import { Legend } from './legend';

interface StackedBarchartProps<DataType> extends ExternalAxesProps {
  data: DataType[];
  bars: {
    accessor: string;
    color: string;
    label: string;
  }[];
  barPadding?: number;
  hideTooltip?: boolean;
  hideLegend?: boolean;
}

interface RequiredDataProperties {
  [key: string]: any;
  valueX: number;
}

const StackedBarChartBase = <DataType extends RequiredDataProperties>({
  data,
  bars,
  barPadding = 0.4,
  hideTooltip,
  hideLegend,
  ...restProps
}: Omit<StackedBarchartProps<DataType>, 'data'> & { data: DataType[] }) => {
  const [barWidth, setBarWidth] = React.useState(0);
  const { offset, innerChartWidth, innerChartHeight, outerChartHeight, outerChartWidth } = useChartDimensions();

  const yMax = React.useMemo(
    () =>
      highestValue(
        data.map((entry) => ({
          total: bars.reduce((acc, curr) => acc + entry[curr.accessor], 0),
        })),
        'total'
      ),
    [data, bars]
  );

  const timeScale = React.useMemo(
    () =>
      scaleBand<number>({
        domain: data.map((d) => d.valueX),
        padding: barPadding,
        range: [0, innerChartWidth],
      }),
    [barPadding, data, innerChartWidth]
  );

  const { colorScale } = React.useMemo(
    () => ({
      colorScale: scaleOrdinal<ReactText, string>({
        domain: bars.map((a) => a.accessor),
        range: bars.map((a) => a.color),
      }),
    }),
    [bars]
  );

  const countScale = React.useMemo(
    () => scaleLinear({ domain: [0, yMax * 1.1], range: [innerChartHeight, 0] }),
    [innerChartHeight, yMax]
  );

  const dataForTooltip = React.useMemo(() => {
    return bars.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.accessor]: {
          ...curr,
          data: data.map((a) => ({
            value: a[curr.accessor] ?? 0,
            time: a.valueX,
          })),
          xAccessor: 'time',
          yAccessor: 'value',
          x: (d: DataType) => timeScale(d.time) ?? 0,
          y: (d: DataType) => countScale(d.value || 0),
        },
      };
    }, {} as any);
  }, [bars, data, timeScale, countScale]);

  return (
    <div style={{ position: 'relative' }}>
      <SafeSVG width={outerChartWidth} height={outerChartHeight}>
        <Group left={offset.left} top={offset.top} width={innerChartWidth} height={innerChartHeight}>
          {!hideTooltip && (
            <TooltipCursor
              data={dataForTooltip}
              xScale={timeScale}
              yScale={countScale}
              invisibleCursor
              translateX={barWidth / 2}
              translateY={-100}
            />
          )}
          <BarStack
            data={data}
            keys={bars.map((a) => a.accessor)}
            height={innerChartHeight}
            x={(d) => d.valueX}
            xScale={timeScale}
            yScale={countScale}
            color={colorScale}>
            {(barStacks) =>
              barStacks.map((barStack) => {
                return barStack.bars.map((bar) => (
                  <Bar
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    bar={bar}
                    setBarWidth={setBarWidth}
                    barWidth={barWidth}
                  />
                ));
              })
            }
          </BarStack>
        </Group>
        <Axes
          yAxisScale={countScale}
          xAxisScale={timeScale}
          offsetLeft={offset.left}
          xAxisTopOffset={innerChartHeight}
          xAxisProps={restProps.xAxisProps}
          yAxisProps={restProps.yAxisProps}
          axisColor={restProps.axisColor}
          numberFormatter={restProps.numberFormatter}
          simplified={restProps.simplified}
          textColor={restProps.textColor}
        />
      </SafeSVG>
      {!hideLegend && <Legend elements={bars} offsetLeft={offset.left} />}
    </div>
  );
};

export const StackedBarChart = withChartWrapper(StackedBarChartBase);

const Bar = ({
  bar,
  setBarWidth,
  barWidth,
}: {
  bar: Pick<BarGroupBar<StackKey>, 'width' | 'height' | 'y' | 'x' | 'color'>;
  setBarWidth: (val: number) => void;
  barWidth: number;
}) => {
  React.useEffect(() => {
    setBarWidth(bar.width);
  }, [setBarWidth, bar]);

  return (
    <rect x={bar.x} y={bar.y} height={bar.height} width={barWidth} fill={bar.color} style={{ pointerEvents: 'none' }} />
  );
};
