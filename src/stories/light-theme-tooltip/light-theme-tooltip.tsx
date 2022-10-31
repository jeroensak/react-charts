import dayjs from 'dayjs';

export const LightThemeTooltip = (
  chartElements: {
    color: string;
    label: string;
    valueX: Date;
    valueY: number;
    x: number;
    y: number;
  }[]
) => {
  const title = dayjs(chartElements[0].valueX).format('DD MMMM YYYY');

  return (
    <div>
      <div className="title">{title}</div>
      {chartElements.map((element, index) => (
        <div className="chart-element" key={index}>
          <span className="chart-element__label" style={{ borderColor: element.color }}>
            {element.label}
          </span>
          <span className="chart-element__value">{element.valueY}</span>
        </div>
      ))}
    </div>
  );
};
