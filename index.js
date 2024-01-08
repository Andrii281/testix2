const fs = require("fs");
const { sync } = require("glob");
const path = require('node:path');

const readCoverageReports = async (source) => {
  return fs.promises.readFile(source, 'utf8')
};


(async function (){
  const [file] = sync("./coverage/**/*coverage-summary.json")
  let responce = await readCoverageReports(file)
  let totals = JSON.parse(responce)['total'];
  let metrics = computeMetrics(totals);
  displaySummary(metrics);
})()

const computeMetrics = (report) => {
  const linesCoverage = report.lines.total !== 0 ? (report.lines.covered / report.lines.total) * 100 : 0;
  const statementsCoverage = report.statements.total !== 0 ? (report.statements.covered / report.statements.total) * 100 : 0;
  const functionsCoverage = report.functions.total !== 0 ? (report.functions.covered / report.functions.total) * 100 : 0;
  const branchesCoverage = report.branches.total !== 0 ? (report.branches.covered / report.branches.total) * 100 : 0;
  const totalCoverage = (statementsCoverage + branchesCoverage) / 2;

  return {
    linesCoverage,
    statementsCoverage,
    functionsCoverage,
    branchesCoverage,
    totalCoverage
  }
}

const displaySummary = (metrics) => {
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")


  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log("asdasd")
  console.log(
    `============================== Affected apps coverage summary ==============================
  Lines coverage         : ${metrics.linesCoverage.toFixed(2)}%
  Statements coverage    : ${metrics.statementsCoverage.toFixed(2)}%
  Functions coverage     : ${metrics.functionsCoverage.toFixed(2)}%
  Branches coverage      : ${metrics.branchesCoverage.toFixed(2)}%
  Total average coverage : ${metrics.totalCoverage.toFixed(2)}%
============================================================================================`,
  );
};