import React from 'react';
import dayjs from 'dayjs';
import { BarChart as BarChartComponent } from '../components/bar-chart/bar-chart';

const bars = [
  { accessor: 'value', color: '#aaa', label: 'value' },
  { accessor: 'otherValue', color: '#ccc', label: 'other value' },
];

const data = [
  { value: 9, otherValue: 3, x: dayjs().startOf('day').subtract(8, 'days').format('DD-MMM-YYYY') },
  { value: 4, otherValue: 4, x: dayjs().startOf('day').subtract(7, 'days').format('DD-MMM-YYYY') },
  { value: 3, otherValue: 5, x: dayjs().startOf('day').subtract(6, 'days').format('DD-MMM-YYYY') },
  { value: 6, otherValue: 6, x: dayjs().startOf('day').subtract(5, 'days').format('DD-MMM-YYYY') },
  { value: 4, otherValue: 5, x: dayjs().startOf('day').subtract(4, 'days').format('DD-MMM-YYYY') },
  { value: 4, otherValue: 4, x: dayjs().startOf('day').subtract(3, 'days').format('DD-MMM-YYYY') },
  { value: 3, otherValue: 5, x: dayjs().startOf('day').subtract(2, 'days').format('DD-MMM-YYYY') },
  { value: 5, otherValue: 6, x: dayjs().startOf('day').subtract(1, 'days').format('DD-MMM-YYYY') },
  { value: 1, otherValue: 8, x: dayjs().startOf('day').format('DD-MMM-YYYY') },
];

export default {
  title: 'Axes',
  parameters: {
    layout: 'fullscreen',
  },
};

const HideAxesTemplate = () => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <BarChartComponent
      data={data}
      bars={bars}
      xAccessor="x"
      height="400px"
      hideBarText
      hideLegend
      hideTooltip
      offset={{ left: 0, bottom: 0 }}
      xAxisProps={{ tickValues: [] }}
      yAxisProps={{ tickValues: [] }}
      axisColor="transparent"
    />
    <p>
      To hide the axes, the offset can be set to 0 and the ticks can be set to an empty array. You could also hide the
      axis line by coloring it transparent.
    </p>
    <pre>{`<BarChart
  offset={{ left: 0, bottom: 0 }}
  xAxisProps={{ tickValues: [] }}
  yAxisProps={{ tickValues: [] }}
  axisColor="transparent" 
/>`}</pre>
  </div>
);

const AxesTicksTemplate = () => (
  <div style={{ marginTop: '80px', padding: '20px' }}>
    <BarChartComponent
      data={data}
      bars={bars}
      xAccessor="x"
      height="400px"
      hideBarText
      hideLegend
      hideTooltip
      yScaleDomain={[0, 10]}
      yAxisProps={{ tickFormat: (t) => `${t}%`, tickValues: [0, 5, 10] }}
      xAxisProps={{ tickFormat: (t) => dayjs(t).format('MM/DD/YYYY') }}
    />
    <p>
      To customize the tick values of the axes, functions can be given as a prop to the <code>xAxisProps</code> or{' '}
      <code>yAxisProps</code>.
    </p>
    <pre>{`<BarChart
  yScaleDomain={[0, 10]}
  yAxisProps={{ tickFormat: (t) => \`\${t}%\`, tickValues: [0, 5, 10] }}
  xAxisProps={{ tickFormat: (t) => dayjs(t).format('MM/DD/YYYY') }}
/>`}</pre>
  </div>
);

export const AxesTicks = AxesTicksTemplate.bind({});

export const HideAxes = HideAxesTemplate.bind({});
