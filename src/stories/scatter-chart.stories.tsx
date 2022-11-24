import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import { ScatterChart as ScatterChartComponent } from '../components/scatter-chart/scatter-chart';

const lines = [
  { accessor: 'value', color: '#008F96', label: 'value', area: '#008F9633' },
  { accessor: 'otherValue', color: '#F5AD52', label: 'other value', dotted: true },
];

const data = [
  {
    x: 3,
    y: 2,
    content: 'A',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 1.5,
    y: 3.5,
    content: 'B',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2,
    y: 3.5,
    content: 'C',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2,
    y: 2,
    content: 'D',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 3,
    y: 3,
    content: 'E',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'F',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'G',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'H',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'I',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'J',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'K',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'L',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
  {
    x: 2.5,
    y: 2,
    content: 'M',
    tooltipData: {
      title: '2.1 Behoud & aantrekken van personeel (inclusief capaciteitsborging) ',
      answerCount: 10,
      chance: '3.1',
      impact: '2.5',
      control: '2.1',
    },
  },
];

export default {
  title: 'Charts',
  component: ScatterChartComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    xScaleDomain: {
      control: 'object',
      defaultValue: [1, 4],
    },
    yScaleDomain: {
      control: 'object',
      defaultValue: [1, 4],
    },
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
      defaultValue: '600px',
    },
    width: {
      control: 'string',
      defaultValue: '600px',
    },
    yAxisProps: {
      control: 'object',
      defaultValue: {
        tickValues: [1, 2, 3, 4],
      },
    },
    xAxisProps: {
      control: 'object',
      defaultValue: {
        tickValues: [1, 2, 3, 4],
      },
    },
    showXGridLines: {
      control: 'boolean',
      defaultValue: false,
    },
    showYGridLines: {
      control: 'boolean',
      defaultValue: false,
    },
    showXCenterGridLine: {
      control: 'boolean',
      defaultValue: true,
    },
    showYCenterGridLine: {
      control: 'boolean',
      defaultValue: true,
    },
    numberFormatter: {
      control: 'function',
      defaultValue: (t) => Math.round(t),
    },
  },
} as ComponentMeta<typeof ScatterChartComponent>;

const ScatterChartTemplate: ComponentStory<typeof ScatterChartComponent> = (args) => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <ScatterChartComponent {...args} tooltipContent={TooltipContent} />
    <br />
    <pre>{`<ScatterChart
  height="400px"
  data={[{ value: 9, otherValue: 3, date: new Date('11/11/2022')}, ...]}
  lines={[
    { accessor: 'value', color: '#008F96', label: 'value', area: '#008F9633' },
    { accessor: 'otherValue', color: '#F5AD52', label: 'other value', dotted: true }
  ]}
/>`}</pre>
  </div>
);

export const ScatterChart = ScatterChartTemplate.bind({});

const TooltipContent = (props: any) => {
  const tooltipData = props[0].tooltipData
  return (
    <div style={{width: '425px'}}>
      <div>{tooltipData.title}</div>
      <div style={{ color: '#9FAAB6', margin: '6px 0' }}>{tooltipData.answerCount} antwoorden</div>
      <div style={{display: 'flex', justifyContent: 'space-between', width: '150px', marginBottom: '2px'}}>
        <span>Kans</span>
        <span>{tooltipData.chance}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', width: '150px', marginBottom: '2px'}}>
        <span>Impact</span>
        <span>{tooltipData.impact}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', width: '150px'}}>
        <span>Beheersing</span>
        <span>{tooltipData.control}</span>
      </div>
    </div>
  );
};
