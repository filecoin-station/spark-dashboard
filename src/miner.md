---
title: Miner RSR
toc: false
---

```js
import { LineGraph } from "./components/line-graph.js";
import { todayInFormat, getDateXDaysAgo } from "./utils/date-utils.js";
```

<div class="hero">
  <body><img src="media/spark-logomark-blue-with-bbox.png" alt="Spark Logo" width="300" /><body>
    <h2>Dashboard Beta</h2>
    <body><a href="https://filspark.com/dashboard" target="_blank" rel="noopener noreferrer">(Click here for Legacy Spark Grafana Dashboard)</a><body>
</div>

<h4>Miner Spark RSR Summary</h4>
<body>This section shows the miner Spark Retrieval Success Rate Score summary. You can adjust the date range. Records start on the 7th April 2024.</body>

```js
const minerID = view(Inputs.text({label: "Enter Miner ID", placeholder: "Type a miner ID...", value: "", submit: true }));
const start = view(Inputs.date({label: "Start", value: getDateXDaysAgo(180) }));
const end = view(Inputs.date({label: "End", value: getDateXDaysAgo(1) }));
```

```js
const isValidMinerId = (minerId) => {
  // Regular expression to match valid Filecoin miner IDs
  const minerIdRegex = /^(f|t)0\d+$/;
  return minerIdRegex.test(minerId);
}

const formatDateField = (dateField) => {
  return new Date(dateField).toISOString().split('T')[0];
}

// Reactive data loader for the input
const getDataForMiner = async () => {
  if (!minerID || !start || !end) return;

  const formattedMinerID = minerID.trim().toLowerCase();
  if (!isValidMinerId(formattedMinerID)) throw `Invalid Miner ID ${minerID}`;
  
  const startDate = formatDateField(start);
  const endDate = formatDateField(end);

  try {
    const response = await fetch(`https://stats.filspark.com/miner/${formattedMinerID}/retrieval-success-rate/summary?from=${startDate}&to=${endDate}`);
    
    if (!response.ok) throw new Error(`Miner ID ${minerID} not found.`);
    
    // Return the fetched JSON data
    return await response.json();
  } catch (error) {
    // Handle and display errors
    throw new Error(`Error: ${error.message}`);
  }
};

const data = await getDataForMiner();
```

<h3>Data for Miner ID: ${minerID}</h3>

<div class="grid grid-cols" style="grid-auto-rows: 500px;">
  <div class="card">${
    resize((width) => LineGraph(data, {width, title: "Retrieval Success Rate", start, end }))
  }</div>
</div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

