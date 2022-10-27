import React from 'react';
import { LineChart } from './line-chart';
import dayjs from 'dayjs';

const lines = [{ accessor: 'value', color: 'red', label: 'value' }];

const data = [
  { value: 3, date: dayjs().startOf('day').subtract(2, 'days').toDate() },
  { value: 6, date: dayjs().startOf('day').subtract(1, 'days').toDate() },
  { value: 1, date: dayjs().startOf('day').toDate() },
];

export const Test = () => {
  return (
    <div style={{paddingTop: '200px'}}>
      <LineChart lines={lines} data={data} height="400px" axisColor='green' textColor='blue' />
    </div>
  );
};
