import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import './light-theme-tooltip/light-theme-tooltip.css';
import dayjs from 'dayjs';
import { LineChart } from '../components/line-chart';
import { LightThemeTooltip } from './light-theme-tooltip/light-theme-tooltip';

const lines = [
  { accessor: 'value', color: '#008F96', label: 'value' },
  { accessor: 'otherValue', color: '#F5AD52', label: 'other value' },
];

const data = [
  { value: 6, otherValue: 6, date: dayjs().startOf('day').subtract(5, 'days').toDate() },
  { value: 4, otherValue: 5, date: dayjs().startOf('day').subtract(4, 'days').toDate() },
  { value: 4, otherValue: 4, date: dayjs().startOf('day').subtract(3, 'days').toDate() },
  { value: 3, otherValue: 5, date: dayjs().startOf('day').subtract(2, 'days').toDate() },
  { value: 5, otherValue: 6, date: dayjs().startOf('day').subtract(1, 'days').toDate() },
  { value: 1, otherValue: 8, date: dayjs().startOf('day').toDate() },
];

export default {
  title: 'Light Tooltip',
  component: LineChart,
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
    xAxisProps: {
      control: 'object',
      defaultValue: {
        numTicks: 6,
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
} as ComponentMeta<typeof LineChart>;

const LightTooltipTemplate: ComponentStory<typeof LineChart> = (args) => {
  React.useEffect(() => {
    document.body.classList.add('light-tooltip');

    return () => {
      document.body.classList.remove('light-tooltip');
    };
  }, []);

  return (
    <div style={{ marginTop: '80px', padding: '20px' }}>
      <LineChart {...args} tooltipContent={LightThemeTooltip} />
      <h3 style={{ marginTop: '40px' }}>CSS for tooltip:</h3>
      <pre>
        {`/* Default classes on a tooltip */
.react-charts__tooltip-content {
  background: white;
  border-color: #ddd;
  color: #333;
  width: 150px;
  position: relative;
  padding: 12px;
}

.react-charts__tooltip-content::after {
  width: 13px;
  height: 13px;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  translate: -6px 8px;
  rotate: 0.125turn;
  z-index: 1;
  background-color: white;
  content: '';
}

/* out-of-bounds classes are added dynamically by default */
.out-of-bounds--right .react-charts__tooltip-content {
  translate: calc(-50% + 20px) -100%;
}

.out-of-bounds--right .react-charts__tooltip-content::after {
  left: calc(100% - 19px);
}

.out-of-bounds--left .react-charts__tooltip-content {
  translate: calc(50% - 20px) -100%;
}

.out-of-bounds--left .react-charts__tooltip-content::after {
  left: 19px;
}



/* custom classes added for styling in the tooltipContent prop */
.title {
  margin-bottom: 8px;
  color: #666;
}

.chart-element {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.chart-element__label {
  border-bottom: 2px solid;
}
`}
      </pre>
    </div>
  );
};

export const LightTooltip = LightTooltipTemplate.bind({});
