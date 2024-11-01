import { jsonFetcher } from "./json-fetcher.js";
import { getDateXDaysAgo } from "../utils/date-utils.js";

const from = getDateXDaysAgo(91);
const to = getDateXDaysAgo(1);

const output = await jsonFetcher(`https://stats.filspark.com/retrieval-result-codes/daily?from=${from}&to=${to}`);  
process.stdout.write(JSON.stringify(output));