import { jsonFetcher } from "./json-fetcher.js";
import { todayInFormat } from "../utils/todayInFormat.js";

const from = "2024-04-01";
const to = todayInFormat();
  
const output = await jsonFetcher(`https://stats.filspark.com/retrieval-success-rate?from=${from}&to=${to}&nonZero=true`);  
process.stdout.write(JSON.stringify(output));