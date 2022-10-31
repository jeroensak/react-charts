import React, { useLayoutEffect } from 'react';

interface TextWithBackgroundProps extends React.SVGAttributes<SVGTextElement> {
  backgroundColor: string;
}

const textBgHeight = 20;
export const TextWithBackground: React.FC<TextWithBackgroundProps> = ({ backgroundColor, children, ...rest }) => {
  const ref = React.useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = React.useState(0);

  useLayoutEffect(() => {
    const textLength = ref?.current?.getComputedTextLength?.() || 0;
    if (textLength) setTextWidth(textLength);
  }, [children]);

  const x = React.useMemo(() => {
    if (rest.textAnchor === 'middle' && typeof rest.x === 'number') {
      return rest.x - textWidth / 2;
    }
    return rest.x;
  }, [rest.x, rest.textAnchor, textWidth]);

  return (
    <>
      <rect
        data-diatism
        x={x}
        width={textWidth}
        y={Number(rest.y) - textBgHeight + 5}
        height={textBgHeight}
        fill={backgroundColor}
        opacity={0.8}
        style={rest.style}
      />
      <text ref={ref} {...rest}>
        {children}
      </text>
    </>
  );
};
