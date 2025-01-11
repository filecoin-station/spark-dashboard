import * as Plot from 'npm:@observablehq/plot'
import * as d3 from 'd3'

export function Histogram (events, { width, title, thresholds }) {
  const data = events.flatMap(d => [
    { type: 'Successful Http', value: d.success_rate * 100 },
    { type: 'Successful', value: d.success_rate_http * 100 }
  ])

  const binnedData = Array.from(new Set(data.map(item => item.type))).flatMap(type => {
    const groupData = data.filter(d => d.type === type)
    const bins = d3
      .bin()
      .domain([0, 100])
      .thresholds(thresholds)(groupData.map(d => d.value))

    return bins.map(bin => ({
      type,
      threshold: `${bin.x0}–${bin.x1}`,
      count: bin.length
    }))
  })

  return Plot.plot({
    marks: [
      Plot.barY(
        binnedData,
        {
          fx: 'threshold',
          y: 'count',
          x: 'type',
          fill: 'type'
        }
      )
    ],
    y: { grid: true },
    x: {
      axis: null,
      padding: 0.1
    },
    color: {
      legend: true,
      label: 'Type'
    },
    width,
    title,
    facet: { label: 'Rate Ranges' }
  })
}
