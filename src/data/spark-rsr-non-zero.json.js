import { jsonFetcher } from "./json-fetcher.js";

const from = "2024-04-01";
const currentDate = new Date(Date.now());
const to = currentDate.toISOString().split('T')[0];
  
const output = await jsonFetcher(`https://stats.filspark.com/retrieval-success-rate?from=${from}&to=${to}&nonZero=true`);  
process.stdout.write(JSON.stringify(output));