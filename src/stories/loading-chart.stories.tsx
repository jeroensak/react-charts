import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChartLoadingAnimation as ChartLoadingAnimationComponent } from '../components/chart-loading-animation';
import { LineChart } from '../components/line-chart';
import { BarChart } from '../components/bar-chart/bar-chart';
import { StackedBarChart } from '../components/bar-chart/stacked-bar-chart';
import dayjs from 'dayjs';
import { useEffect } from '@storybook/addons';

export default {
  title: 'Chart Loading Animation',
  component: ChartLoadingAnimationComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ChartLoadingAnimationComponent>;

const LineChartTemplate: ComponentStory<typeof ChartLoadingAnimationComponent> = () => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <ChartLoadingAnimationComponent height="400px" ChartComponent={LineChart} />
  </div>
);

export const LineChartAnimation = LineChartTemplate.bind({});

const BarChartTemplate: ComponentStory<typeof ChartLoadingAnimationComponent> = () => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <ChartLoadingAnimationComponent height="400px" ChartComponent={BarChart} />
  </div>
);

export const BarChartAnimation = BarChartTemplate.bind({});

const StackedBarChartTemplate: ComponentStory<typeof ChartLoadingAnimationComponent> = () => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <ChartLoadingAnimationComponent height="400px" ChartComponent={StackedBarChart} />
  </div>
);

export const StackedBarChartAnimation = StackedBarChartTemplate.bind({});

const lines = [
  { accessor: 'value', color: '#008F96', label: 'value' },
  { accessor: 'otherValue', color: '#F5AD52', label: 'other value' },
];

const loadedData = [
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

const LoadedChartTemplate: ComponentStory<typeof ChartLoadingAnimationComponent> = () => {
  const [data, setData] = React.useState<React.ComponentProps<typeof LineChart>['data'] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setData(loadedData);
    }, 2000);
  }, []);

  return (
    <div style={{ marginTop: '80px', padding: '20px' }}>
      {data ? (
        <LineChart height="400px" data={data} lines={lines} />
      ) : (
        <ChartLoadingAnimationComponent height="400px" ChartComponent={LineChart} />
      )}
    </div>
  );
};

export const LoadedChartAnimation = LoadedChartTemplate.bind({});
