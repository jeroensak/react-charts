import React from 'react';
import dayjs from 'dayjs';
import { LineChart as LineChartComponent } from '../index';
import { BarChart as BarChartComponent } from '../index';

const lines = [{ accessor: 'value', color: '#4079FF', label: 'value' }];

const data = Array(15)
  .fill(null)
  .map((_, i) => ({
    date: dayjs()
      .startOf('day')
      .subtract(15 - i, 'days')
      .toDate(),
    value: Math.random() * 2 - 1,
  }));

export default {
  title: 'Padding',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    chartYDomainPadding: {
      control: 'number',
      defaultValue: 0.2,
    },
    yScaleDomain: {
      control: 'object',
      defaultValue: [-2, 2],
    },
    barPadding: {
      control: 'number',
      defaultValue: 0.2,
    },
  },
};

const PaddingTemplate = (args) => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <div style={{ display: 'flex', gap: '32px' }}>
      <LineChartComponent
        data={data}
        lines={lines}
        height="400px"
        hideLegend
        hideTooltip
        chartYDomainPadding={args.chartYDomainPadding}
        xAxisProps={{ numTicks: 5 }}
      />
      <BarChartComponent
        data={data}
        xAccessor="date"
        hideBarText
        bars={lines}
        height="400px"
        hideLegend
        hideTooltip
        yScaleDomain={args.yScaleDomain}
        xAxisProps={{ numTicks: 5 }}
        barPadding={args.barPadding}
      />
    </div>
    <p style={{ maxWidth: '700px', lineHeight: '20px' }}>
      To add some padding to your chart there are multiple options.
      <ul>
        <li>
          <code>chartYDomainPadding</code> will add a relative padding to the top and bottom of your line chart, or top
          of your (stacked) bar chart as a percent (e.g. <code>0.2</code> will add 20%).
        </li>
        <li>
          <code>yScaleDomain</code> will set the domain of the y axis of the chart, creating a fixed viewport.
        </li>
        <li>
          <code>barPadding</code> will set the padding between bar groups on the bar chart.
        </li>
      </ul>
    </p>
    <pre>{`<LineChart chartYDomainPadding={${args.chartYDomainPadding}} />

<BarChart yScaleDomain={[${args.yScaleDomain[0]}, ${args.yScaleDomain[1]}]} barPadding={${args.barPadding}} />`}</pre>
  </div>
);

export const Padding = PaddingTemplate.bind({});
