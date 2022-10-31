import { AxisBottom, AxisLeft } from '@visx/axis';
import { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale';
import dayjs from 'dayjs';

export interface ExternalAxesProps {
  xAxisProps?: Partial<React.ComponentProps<typeof AxisBottom>>;
  yAxisProps?: Partial<React.ComponentProps<typeof AxisLeft>>;
  axisColor?: string;
  textColor?: string;
  simplified?: boolean;
  numberFormatter?: (value: number | bigint) => string;
}

interface AxesProps {
  yAxisScale: ScaleLinear<number, number, never>;
  xAxisScale: ScaleTime<number, number, never> | ScaleBand<number>;
  offsetLeft: number;
  xAxisTopOffset: number;
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
  tickFormat: (t) => typeof t === 'object' ? dayjs(t).format('DD MMM') : t,
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

export const Axes = ({
  axisColor,
  xAxisProps,
  yAxisProps,
  simplified,
  yAxisScale,
  xAxisScale,
  textColor,
  offsetLeft,
  xAxisTopOffset,
  numberFormatter,
}: ExternalAxesProps & AxesProps) => {
  return (
    <>
      <AxisLeft
        left={offsetLeft}
        scale={yAxisScale}
        {...defaultYAxisProps(axisColor, textColor)}
        tickValues={simplified ? yAxisScale.domain() : defaultYAxisProps(axisColor, textColor).tickValues}
        tickStroke={simplified ? 'transparent' : defaultYAxisProps(axisColor, textColor).tickStroke}
        tickFormat={numberFormatter}
        {...yAxisProps}
      />
      <AxisBottom
        top={xAxisTopOffset}
        left={offsetLeft}
        scale={xAxisScale}
        {...defaultXAxisProps(axisColor, textColor)}
        tickValues={simplified ? xAxisScale.domain() : defaultXAxisProps(axisColor, textColor).tickValues}
        tickStroke={simplified ? 'transparent' : defaultXAxisProps(axisColor, textColor).tickStroke}
        {...xAxisProps}
      />
    </>
  );
};
