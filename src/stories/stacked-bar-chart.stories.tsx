import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import { StackedBarChart as StackedBarChartComponent } from '../components/bar-chart/stacked-bar-chart';

const bars = [
  { accessor: 'value', color: '#008F96', label: 'value' },
  { accessor: 'otherValue', color: '#F5AD52', label: 'other value' },
];

const data = [
  { value: 9, otherValue: 3, x: dayjs().startOf('day').subtract(8, 'days').toDate() },
  { value: 4, otherValue: 4, x: dayjs().startOf('day').subtract(7, 'days').toDate() },
  { value: 3, otherValue: 5, x: dayjs().startOf('day').subtract(6, 'days').toDate() },
  { value: 6, otherValue: 6, x: dayjs().startOf('day').subtract(5, 'days').toDate() },
  { value: 4, otherValue: 5, x: dayjs().startOf('day').subtract(4, 'days').toDate() },
  { value: 4, otherValue: 4, x: dayjs().startOf('day').subtract(3, 'days').toDate() },
  { value: 3, otherValue: 5, x: dayjs().startOf('day').subtract(2, 'days').toDate() },
  { value: 5, otherValue: 6, x: dayjs().startOf('day').subtract(1, 'days').toDate() },
  { value: 1, otherValue: 8, x: dayjs().startOf('day').toDate() },
];

export default {
  title: 'Charts',
  component: StackedBarChartComponent,
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
    hideBarText: {
      control: 'boolean',
      defaultValue: false,
    },
    xAccessor: {
      control: 'string',
      defaultValue: 'x',
    },
  },
} as ComponentMeta<typeof StackedBarChartComponent>;

const StackedBarChartTemplate: ComponentStory<typeof StackedBarChartComponent> = (args) => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <StackedBarChartComponent {...args} />
    <br />
    <pre>{`<StackedBarChart
  height="400px"
  data={[{ value: 9, otherValue: 3, x: '31-10-2022'}, ...]}
  xAccessor="x"
  bars={[
    { accessor: 'value', color: '#008F96', label: 'value', area: '#008F9633' },
    { accessor: 'otherValue', color: '#F5AD52', label: 'other value', dotted: true }
  ]}
/>`}</pre>
  </div>
);

export const StackedBarChart = StackedBarChartTemplate.bind({});
