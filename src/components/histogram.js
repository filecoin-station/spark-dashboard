import * as Plot from "npm:@observablehq/plot";

export function Histogram(events, { width, title, thresholds }) {
    return Plot.plot({
        y: {grid: true },
        x: { percent: true },
        title,
        width,
        marks: [
        Plot.rectY(events, Plot.binX({
            y: "count", title: (elems) =>  `${elems.length} SPs`},
            {x: {thresholds, value: "success_rate"}, fill: "#FF00E6"})),
        Plot.ruleY([0])
        ],
    })
}