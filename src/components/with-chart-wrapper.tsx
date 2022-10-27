import React, { SVGAttributes } from 'react';
import useMeasure from 'react-use-measure';
import { TooltipComponent } from './tooltip/tooltip-component';
import { TooltipContent, TooltipContentProps } from './tooltip/tooltip-content';

type TOffset = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

const defaultValue = {
  outerChartWidth: 0,
  outerChartHeight: 0,
  innerChartWidth: 0,
  innerChartHeight: 0,
  offset: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  setOffset: (_: Partial<TOffset>) => {},
};

type offsetProp = {
  offset?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
};

export interface ChartDimensionsProps {
  /**
   * Any valid svg width property.
   * Things like 100% will be calculated into a pixel value on render.
   */
  width?: SVGAttributes<SVGElement>['width'];
  /**
   * Any valid svg height property.
   * Things like 100% will be calculated into a pixel value on render.
   */
  height: SVGAttributes<SVGElement>['height'];
}

const ChartDimensionsContext = React.createContext<typeof defaultValue>(defaultValue);

export const useChartDimensions = () => React.useContext(ChartDimensionsContext);

export const withChartWrapper =
  <ChartChildrenProps extends object>(
    ChartChildren: React.ComponentType<ChartChildrenProps>,
    defaultOffset = { left: 45, top: 0, right: 0, bottom: 30 }
  ) =>
  (props: ChartChildrenProps & ChartDimensionsProps & TooltipContentProps & offsetProp) => {
    const { width = '100%' } = props;
    const [ref, { width: calculatedWidth, height: calculatedHeight }] = useMeasure();
    const [offset, setFullOffset] = React.useState<TOffset>({
      ...defaultOffset,
      ...props.offset,
    });

    const setOffset = React.useCallback(
      (newOffset: Partial<TOffset>) => setFullOffset((v) => ({ ...v, ...newOffset })),
      []
    );

    const value = React.useMemo(
      () => ({
        outerChartWidth: calculatedWidth,
        outerChartHeight: calculatedHeight,
        innerChartWidth: calculatedWidth - offset.left - offset.right,
        innerChartHeight: calculatedHeight - offset.top - offset.bottom,
        setOffset,
        offset,
      }),
      [calculatedWidth, calculatedHeight, offset, setOffset]
    );

    return (
      <div ref={ref} style={{ width, height: props.height }}>
        {calculatedHeight && calculatedWidth ? (
          <>
            <TooltipComponent>
              <ChartDimensionsContext.Provider value={value}>
                <ChartChildren {...props} />
                <TooltipContent
                  tooltipContent={props.tooltipContent}
                  tooltipTitle={props.tooltipTitle}
                  tooltipXOffset={props.tooltipXOffset}
                />
              </ChartDimensionsContext.Provider>
            </TooltipComponent>
          </>
        ) : null}
      </div>
    );
  };
