# Spark

```js
const SparkRates = FileAttachment("./data/spark-rsr.json").json();
```

```js
display(
  Plot.plot({
    title: "Retrieval Success Rate",
    x: {type: "utc", ticks: "day", label: null},
    y: {grid: true, inset: 10, label: "RSR"},
    marks: [
      Plot.lineY(SparkRates, {
        x: "day",
        y: "success_rate",
        // z: null, // varying color, not series
        stroke: "#ff8800",
        // curve: ""
      })
    ]
  })
);
```