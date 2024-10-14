import { jsonFetcher } from "./json-fetcher.js";
import { todayInFormat } from "../utils/todayInFormat.js";

const from = "2024-04-01";
const to = todayInFormat();

const output = await jsonFetcher(`https://stats.filspark.com/miners/retrieval-success-rate/summary?from=${from}&to=${to}`);  
process.stdout.write(JSON.stringify(output));