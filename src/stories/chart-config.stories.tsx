import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import { LineChart as LineChartComponent } from '../components/line-chart';
import { ReactChartsConfigProvider } from '../components/react-charts-config';
import { BarChart as BarChartComponent } from '../components/bar-chart/bar-chart';

const elements = [
  { accessor: 'value', color: '#008F96', label: 'value' },
  { accessor: 'otherValue', color: '#F5AD52', label: 'other value' },
];

const data = [
  { value: 9, otherValue: 3, date: dayjs().startOf('day').subtract(8, 'days').toDate() },
  { value: 4, otherValue: 4, date: dayjs().startOf('day').subtract(7, 'days').toDate() },
  { value: 3, otherValue: 5, date: dayjs().startOf('day').subtract(6, 'days').toDate() },
  { value: 6, otherValue: 6, date: dayjs().startOf('day').subtract(5, 'days').toDate() },
  { value: 4, otherValue: 5, date: dayjs().startOf('day').subtract(4, 'days').toDate() },
  { value: 4, otherValue: 4, date: dayjs().startOf('day').subtract(3, 'days').toDate() },
  { value: 3, otherValue: 5, date: dayjs().startOf('day').subtract(2, 'days').toDate() },
  { value: 5, otherValue: 6, date: dayjs().startOf('day').subtract(1, 'days').toDate() },
  { value: 1, otherValue: 8, date: dayjs().startOf('day').toDate() },
];

export default {
  title: 'Chart Config',
  component: ReactChartsConfigProvider,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    hideTooltip: {
      control: 'boolean',
      defaultValue: false,
    },
    hideLegend: {
      control: 'boolean',
      defaultValue: false,
    },
    showYGridLines: {
      control: 'boolean',
      defaultValue: true,
    },
  },
} as ComponentMeta<typeof ReactChartsConfigProvider>;

const ChartConfigTemplate: ComponentStory<typeof ReactChartsConfigProvider> = (args) => (
  <ReactChartsConfigProvider {...args}>
    <div style={{ marginTop: '80px', padding: '20px', display: 'flex' }}>
      <LineChartComponent height="400px" data={data} lines={elements} />
      <BarChartComponent height="400px" data={data} bars={elements} xAccessor="date" />
    </div>
  </ReactChartsConfigProvider>
);

export const ChartConfig = ChartConfigTemplate.bind({});
