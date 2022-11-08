import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import { LineChart as LineChartComponent } from '../components/line-chart';

const lines = [
  { accessor: 'value', color: '#008F96', label: 'value', area: '#008F9633' },
  { accessor: 'otherValue', color: '#F5AD52', label: 'other value', dotted: true },
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
  title: 'Charts',
  component: LineChartComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    simplified: {
      control: 'boolean',
      defaultValue: false,
    },
    hideTooltip: {
      control: 'boolean',
      defaultValue: false,
    },
    hideLegend: {
      control: 'boolean',
      defaultValue: false,
    },
    lines: {
      control: 'object',
      defaultValue: lines,
    },
    data: {
      control: 'object',
      defaultValue: data,
    },
    height: {
      control: 'string',
      defaultValue: '400px',
    },
    yAxisProps: {
      control: 'object',
      defaultValue: {
        tickValues: [2, 4, 6, 8],
      },
    },
    showXGridLines: {
      control: 'boolean',
      defaultValue: false,
    },
    showYGridLines: {
      control: 'boolean',
      defaultValue: true,
    },
  },
} as ComponentMeta<typeof LineChartComponent>;

const LineChartTemplate: ComponentStory<typeof LineChartComponent> = (args) => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <LineChartComponent {...args} />
  </div>
);

export const LineChart = LineChartTemplate.bind({});
