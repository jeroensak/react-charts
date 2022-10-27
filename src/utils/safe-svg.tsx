import React from 'react';

type SafeSVGProps = React.SVGProps<SVGSVGElement>;

/**
 * This component make sure a width en height is set, otherwise
 * it won't render a graph (yet). This prevents weird errors
 * in visx for data trying to render within 0 px.
 */
export const SafeSVG = (props: SafeSVGProps) => {
  if (!props.height || !props.width) return null;

  return <svg xmlns="http://www.w3.org/2000/svg" {...props} style={{ ...(props.style || {}), overflow: 'visible' }} />;
};
