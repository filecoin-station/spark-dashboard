---
toc: false
---

```js
import { LineGraph } from "./components/line-graph.js";
import { Histogram } from "./components/histogram.js";
import { todayInFormat, getDateXDaysAgo } from "./utils/date-utils.js";
import { combine, move, clone } from "./utils/ratios-utils.js";
const SparkRates = FileAttachment("./data/spark-rsr.json").json();
const SparkNonZeroRates = FileAttachment("./data/spark-rsr-non-zero.json").json();
const SparkMinerRates = FileAttachment("./data/spark-miners-rsr.json").json();
const SparkRetrievalResultCodes = FileAttachment("./data/spark-retrieval-result-codes.json").json();
```

```js
const nonZeroSparkMinerRates = SparkMinerRates.filter((record) => record.success_rate != 0)
const sortedSparkMinerRates = SparkMinerRates.sort((recordA, recordB) => recordB.success_rate - recordA.success_rate)
```

<div class="hero">
  <body><img src="media/spark-logomark-blue-with-bbox.png" alt="Spark Logo" width="300" /><body>
    <h2>Dashboard Beta</h2>
    <body><a href="https://filspark.com/dashboard" target="_blank" rel="noopener noreferrer">(Click here for Legacy Spark Grafana Dashboard)</a><body>
</div>

<h4>Overall Spark RSR</h4>
<body>This section shows the overall Spark Retrieval Success Rate Score of Filecoin. You can adjust the date range. Records start on the 7th April 2024.</body>

```js
const start = view(Inputs.date({label: "Start", value: getDateXDaysAgo(180) }));
const end = view(Inputs.date({label: "End", value: getDateXDaysAgo(1) }));
```



<div class="grid grid-cols-2" style="grid-auto-rows: 500px;">
  <div class="card">${
    resize((width) => LineGraph(SparkRates, {width, title: "Retrieval Success Rate", start, end }))
  }</div>
  <div class="card">${
    resize((width) => LineGraph(SparkNonZeroRates, {width, title: "Non-zero Miners: Retrieval Success Rate", start, end }))
  }</div>
</div>

<div class="divider"></div>



<h4>Spark Miner RSR Histograms</h4>
<body>The following histograms use the Spark RSR values calculated in aggregate for each Filecoin Storage Provider over the past 30 days.</body>


<div class="grid grid-cols-2" style="grid-auto-rows: 500px;">
  <div class="card">${
    resize((width) => Histogram(SparkMinerRates, { width, title: "Retrieval Success Rate Buckets", thresholds: 10 }))
  }</div>
  <div class="card">${
    resize((width) => Histogram(nonZeroSparkMinerRates, { width, title: "Non-zero Miners: Retrieval Success Rate Buckets", thresholds: 10 }))
  }</div>
</div>

<div class="divider"></div>

<h4>Spark Retrieval Result Codes</h4>
<body>This section shows the Spark Retrieval Result Codes breakdown.</body>

```js
const mapping = {
  'HTTP 5xx': [
    /^HTTP_5/,
    /^ERROR_5/,
    'BAD_GATEWAY',
    'GATEWAY_TIMEOUT'
  ],
  'Graphsync timeout': [
    'LASSIE_504'
  ],
  'Graphsync error': [
    /^LASSIE_(?!504)/
  ],
  'IPNI no advertisement': [
    'IPNI_ERROR_404',
    'IPNI_NO_VALID_ADVERTISEMENT',
  ],
  'IPNI error': [
    /^IPNI_ERROR_/
  ],
  'Other': [
    'CANNOT_PARSE_CAR_FILE',
    'CAR_TOO_LARGE',
    'UNKNOWN_FETCH_ERROR',
    'HOSTNAME_DNS_ERROR',
    'CONNECTION_REFUSED',
    'UNSUPPORTED_MULTIADDR_FORMAT',
    /^ERROR_4/,
    'TIMEOUT'
  ]
}
```

```js
const tidy = clone(SparkRetrievalResultCodes).flatMap(({ day, rates }) => {
  for (const [key, value] of Object.entries(rates)) {
    rates[key] = Number(value)
  }
  for (const [label, codes] of Object.entries(mapping)) {
    combine(rates, label, codes)
  }
  const sorted = {}
  move(rates, sorted ,'OK')
  move(rates, sorted, 'HTTP 5xx')
  move(rates, sorted, 'Graphsync error')
  move(rates, sorted, 'IPNI error')
  move(rates, sorted, 'IPNI no advertisement')
  for (const [key, value] of Object.entries(rates)) {
    if (key !== 'Other') {
      move(rates, sorted, key)
    }
  }
  move(rates, sorted, 'Other')

  return Object.entries(sorted).map(([code, rate]) => ({ day: new Date(day), code, rate }))
})
```

<div class="grid grid-cols-2" style="grid-auto-rows: 500px;">
  <div class="card">
    ${Plot.plot({
      x: {label: null, type: "band", ticks: "week" },
      y: {
        percent: true
      },
      color: {
        scheme: "Accent",
        legend: "swatches",
        width: 2000,
        label: "Codes"
      },
      marks: [
        Plot.rectY(tidy, {
          x: "day",
          y: "rate",
          fill: "code",
          offset: "normalize",
          sort: {color: null, x: "-y" },
          interval: 'day'
        })
      ]
    })}
  </div>
</div>

<details>
<summary>Result code to label mapping</summary>
<pre>
${JSON.stringify(
  mapping,
  (key, value) => {
    return value instanceof RegExp
      ? value.toString()
      : value
  },
  2
)}
</pre>
</details>


<div class="divider"></div>

<h4>Spark Miner RSR Table</h4>
<body>The following table shows the Spark RSR values calculated in aggregate for each Filecoin Storage Provider over the past 30 days.</body>

```js
const search = view(Inputs.search(sortedSparkMinerRates, {placeholder: "Search Storage Providers…"}));
```

<div class="card" style="padding: 0;">
  ${Inputs.table(search, {rows: 16})}
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

.divider {
  margin: 50px;
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
