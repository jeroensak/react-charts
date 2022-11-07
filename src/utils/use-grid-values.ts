import React from 'react';

export const useYGridValues = (
  showYGridLines: boolean,
  yTickValues: any[],
  yScale: (v: any) => number,
  innerChartHeight: number
) =>
  React.useMemo(
    () =>
      showYGridLines
        ? yTickValues.map((v) => Math.round(yScale(v))).filter((v) => v !== 0 && v !== innerChartHeight)
        : null,
    [showYGridLines, yTickValues, yScale, innerChartHeight]
  );

export const useXGridValues = (
  showXGridLines: boolean,
  xTickValues: any[],
  xScale: (v: any) => number,
  offsetLeft: number,
  outerChartWidth: number
) =>
  React.useMemo(
    () =>
      showXGridLines
        ? xTickValues
            .map((v) => Math.round(xScale(v) + offsetLeft))
            .filter((v) => v !== offsetLeft && v !== outerChartWidth)
        : null,
    [showXGridLines, xTickValues, xScale, offsetLeft, outerChartWidth]
  );
