export interface GeneralChartProps {
  hideTooltip?: boolean;
  hideLegend?: boolean;
  xScaleDomain?: [string, string] | [number, number] | [Date, Date];
  yScaleDomain?: [number, number];
  showYGridLines?: boolean;
}
