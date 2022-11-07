export interface GeneralChartProps {
  hideTooltip?: boolean;
  hideLegend?: boolean;
  showYGridLines?: boolean;
  xScaleDomain?: [string, string] | [number, number] | [Date, Date];
  yScaleDomain?: [number, number];
  chartYDomainPadding?: number;
}
