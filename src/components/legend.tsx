import { LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import React from 'react';

export const Legend = ({ offsetLeft, elements }: { offsetLeft: number; elements: { color: string; label: string }[] }) => {

  const ordinalColorScale = scaleOrdinal({
    domain: elements.map((l) => l.label),
    range: elements.map((l) => l.color),
  });
  
  return (
    <div style={{ paddingLeft: offsetLeft }}>
      <LegendOrdinal scale={ordinalColorScale} direction="row" labelMargin="0 20px 0 0" />
    </div>
  );
};
