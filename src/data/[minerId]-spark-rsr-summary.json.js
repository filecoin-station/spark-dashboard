import { jsonFetcher } from "./json-fetcher.js";
import { getDateXDaysAgo } from "../utils/date-utils.js";
import {parseArgs} from "node:util";

const {
  values: {minerId}
} = parseArgs({
  options: {minerId: {type: "string"}}
});

const start = '2024-04-07';
const end = getDateXDaysAgo(1);

const summary = await jsonFetcher(
  `https://stats.filspark.com/miner/${minerId}/retrieval-success-rate/summary?from=${start}&to=${end}`
);


process.stdout.write(JSON.stringify(summary));