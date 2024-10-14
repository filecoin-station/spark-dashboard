import * as Plot from "npm:@observablehq/plot";

export function Leaderboard(records) {
    const sortedAndPaginatedRecords = records.slice(0,20)
    return Plot.plot({
        y: {padding: 0.4},
        marks: [
            Plot.barX(sortedAndPaginatedRecords, {x: "success_rate", y: "miner_id"})
        ]
    })
}