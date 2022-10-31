import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import { BarChart as BarChartComponent } from '../components/bar-chart/bar-chart';

const bars = [
  { accessor: 'value', color: '#008F96', label: 'value' },
  { accessor: 'otherValue', color: '#F5AD52', label: 'other value' },
];

const data = [
  { value: 9, otherValue: 3, valueX: dayjs().startOf('day').subtract(8, 'days').toDate() },
  { value: 4, otherValue: 4, valueX: dayjs().startOf('day').subtract(7, 'days').toDate() },
  { value: 3, otherValue: 5, valueX: dayjs().startOf('day').subtract(6, 'days').toDate() },
  { value: 6, otherValue: 6, valueX: dayjs().startOf('day').subtract(5, 'days').toDate() },
  { value: 4, otherValue: 5, valueX: dayjs().startOf('day').subtract(4, 'days').toDate() },
  { value: 4, otherValue: 4, valueX: dayjs().startOf('day').subtract(3, 'days').toDate() },
  { value: 3, otherValue: 5, valueX: dayjs().startOf('day').subtract(2, 'days').toDate() },
  { value: 5, otherValue: 6, valueX: dayjs().startOf('day').subtract(1, 'days').toDate() },
  { value: 1, otherValue: 8, valueX: dayjs().startOf('day').toDate() },
];

export default {
  title: 'Bar Chart',
  component: BarChartComponent,
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
    bars: {
      control: 'object',
      defaultValue: bars,
    },
    data: {
      control: 'object',
      defaultValue: data,
    },
    height: {
      control: 'string',
      defaultValue: '400px',
    },
  },
} as ComponentMeta<typeof BarChartComponent>;

const BarChartTemplate: ComponentStory<typeof BarChartComponent> = (args) => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <BarChartComponent {...args} />
  </div>
);

export const BarChart = BarChartTemplate.bind({});