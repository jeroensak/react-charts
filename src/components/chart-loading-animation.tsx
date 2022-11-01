import dayjs from 'dayjs';
import React from 'react';
import { BarChart } from './bar-chart/bar-chart';
import { StackedBarChart } from './bar-chart/stacked-bar-chart';
import { LineChart } from './line-chart';

const elements = [{ accessor: 'value', color: '#6E7884', label: '...' }];

const data = [
  {
    value: 9,
    date: dayjs().startOf('day').subtract(8, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(8, 'days').format('DD-MM'),
  },
  {
    value: 4,
    date: dayjs().startOf('day').subtract(7, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(7, 'days').format('DD-MM'),
  },
  {
    value: 3,
    date: dayjs().startOf('day').subtract(6, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(6, 'days').format('DD-MM'),
  },
  {
    value: 6,
    date: dayjs().startOf('day').subtract(5, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(5, 'days').format('DD-MM'),
  },
  {
    value: 4,
    date: dayjs().startOf('day').subtract(4, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(4, 'days').format('DD-MM'),
  },
  {
    value: 4,
    date: dayjs().startOf('day').subtract(3, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(3, 'days').format('DD-MM'),
  },
  {
    value: 3,
    date: dayjs().startOf('day').subtract(2, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(2, 'days').format('DD-MM'),
  },
  {
    value: 5,
    date: dayjs().startOf('day').subtract(1, 'days').toDate(),
    valueX: dayjs().startOf('day').subtract(1, 'days').format('DD-MM'),
  },
  { value: 1, date: dayjs().startOf('day').toDate(), valueX: dayjs().startOf('day').format('DD-MM') },
];

export const ChartLoadingAnimation = ({
  ChartComponent,
  height,
  hideLegend,
}: {
  ChartComponent: typeof LineChart | typeof BarChart | typeof StackedBarChart;
  height: string | number;
  hideLegend?: boolean;
}) => {
  return (
    <ChartComponent
      data={data}
      className="react-charts__loading-chart"
      lines={elements}
      bars={elements}
      height={height}
      hideTooltip
      xAxisProps={{ tickValues: [] }}
      yAxisProps={{ tickValues: [] }}
      axisColor="#414952"
      hideBarText
      hideLegend={hideLegend}
    />
  );
};
