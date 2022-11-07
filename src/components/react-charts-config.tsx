import React from 'react';
import { GeneralChartProps } from '../chart.interface';
import { ExternalAxesProps } from './axes';

interface ConfigProps extends Omit<GeneralChartProps, 'xScaleDomain' | 'yScaleDomain'>, ExternalAxesProps {}

export const ReactChartsConfigContext = React.createContext<ConfigProps>({});

export const ReactChartsConfigProvider: React.FC<React.PropsWithChildren<ConfigProps>> = ({ children, ...config }) => {
  return <ReactChartsConfigContext.Provider value={config}>{children}</ReactChartsConfigContext.Provider>;
};
