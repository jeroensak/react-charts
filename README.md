# react-charts

Basic charts components to be used in a react project. Charts are based on [visx](https://airbnb.io/visx/), which is based on [d3js](https://d3js.org/).
These charts are simple wrappers to make it easier to quickly implement re-usable charts while still being customizable.
All charts are rendered as svg and directly usable in React.

<br />

## Installation

Install the package with `npm install @js/react-charts --save` or `yarn add @js/react-charts`.

Add the optional styling for the tooltip and chart loading animation by importing `@js/react-charts/styles.css`.

<br />

## Charts

Currently available charts are a line chart, bar chart and stacked bar chart.

<br />

## Props

### Required

Required are only the height of the chart, the data and the elements (lines for line chart, bars for (stacked) bar chart).

#### Data

The data prop accepts an array of objects aggregated and sorted on dates.

example:

```
[{
  value: 3,
  otherValue: 5,
  date: Date('2022-10-30T00:00:00Z')
}, {
  value: 9,
  otherValue: 1,
  date: Date('2022-10-31T00:00:00Z')
}]
```

#### Elements

The lines or bars prop accepts an array of objects containing the accessor, label and color.

example:

```
[{
  accessor: 'value',
  color: 'green',
  label: 'Value'
}, {
  accessor: 'otherValue',
  color: 'red',
  label: 'Other value'
}]
```

#### Height

The height defines the total height of the chart, including the axes.

### Optional

There are multiple shared optional props like -but not excluded to- the width; hiding the legend, tooltip or bar text; axis and text colors; tooltip content; and deeper axis and tooltip props for customizing.

#### Width

The width defines the total width of the chart, including the axes.

#### Tooltip props

You can hide the tooltip with `hideTooltip` or replace the content of the tooltip with a custom component on `tooltipContent`. The component will receive the hovered data. If you need extra data in the tooltip that you don't want to show in the chart, you can add those attributes to the `data` prop on the chart, but leaving out a chart element for it.

#### Axis props

all axis props supported by visx (https://airbnb.io/visx/docs/axis) are supported. Add the props as attributes to an object and pass them as `yAxisProps` or `xAxisProps`. These will overwrite default props.

#### Other props

All other currently available props are showed in storybook.

<br />

## High level config

To provide a set of props for all charts within (a part of) the application, a `ReactChartsConfigProvider` and `ReactChartsConfigContext` are available. It accepts a set of props that will be used by all charts by default. These props are still overwrite-able for individual charts.

<br />

## Placeholder

A simple placeholder wrapper is available as the `ChartLoadingAnimation` component. This component shows a simple placeholder with fake data, pulsing. Easily replacable by custom placeholders.

example:

```
{data ? (
  <LineChart height={height} data={data} lines={lines} />
) : (
  <ChartLoadingAnimationComponent height={height} ChartComponent={LineChart} />
)}
```

<br />

## Tooltip styles

The tooltip can be styled using only the existing css classes without having to add a custom `tooltipComponent` to every chart.

### Available css classes

`.react-charts__tooltip-content`

`.react-charts__tooltip-title`

`.react-charts__tooltip__table`

`.react-charts__tooltip__table__element-color`

### Out of bounds

If the tooltip is going out of bounds it is aligned differently to always be visible. For custom styling the follow css classes can be addressed.

`.out-of-bounds--right`

`.out-of-bounds--left`

<br />

## Storybook

To start storybook clone this package. Run `npm install` or `yarn` to install the packages.

Run `npm run storybook` or `yarn storybook` to start storybook.
