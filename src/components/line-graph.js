import * as Plot from "npm:@observablehq/plot";

export function LineGraph(events, {width, height, title} = {}) {
    return Plot.plot({
        title,
        width,
        height,
        x: {type: "utc", ticks: "month", label: null},
        y: {grid: true, inset: 10, label: "RSR"},
        marks: [
            Plot.lineY(events, {
                x: "day",
                y: "success_rate",
                // z: null, // varying color, not series
                stroke: "#ff8800",
                // curve: ""
            })
        ]
    })
}