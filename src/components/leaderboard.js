import * as Plot from "npm:@observablehq/plot";

export function Leaderboard(records) {
    const sortedAndPaginatedRecords = records.slice(0,20)
    <div class="card" style="padding: 0;">
    ${Inputs.table(baHourlyClean, {rows: 16})}
  </div>
}