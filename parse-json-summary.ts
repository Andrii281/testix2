/* eslint-disable no-console */
/*
Current script serves the following:
- parse json-summary reports (one .json file per app) and find all four coverage metrics (lines, statements, functions, branches)
- compute average coverage for monorepo project
- display coverage metrics on job's terminal, during gitlab pipeline
*/

import fs from 'fs';
import { resolve } from 'path';

import { sync } from 'glob';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

// Initial value for coverage metrics
const initialCoverage: CoverageMetrics = {
  lines: { total: 0, covered: 0 },
  statements: { total: 0, covered: 0 },
  functions: { total: 0, covered: 0 },
  branches: { total: 0, covered: 0 },
};

// Utility Function
const computeMetrics = (reports: CoverageMetrics[]): DisplayMetrics => {
  const cTotal = reports.reduce((accum: CoverageMetrics, parsedReport) => {
    accum.lines.total += parsedReport.lines.total;
    accum.statements.total += parsedReport.statements.total;
    accum.functions.total += parsedReport.functions.total;
    accum.branches.total += parsedReport.branches.total;

    accum.lines.covered += parsedReport.lines.covered;
    accum.statements.covered += parsedReport.statements.covered;
    accum.functions.covered += parsedReport.functions.covered;
    accum.branches.covered += parsedReport.branches.covered;

    return accum;
  }, initialCoverage);

  const linesCoverage = cTotal.lines.covered !== 0 ? (cTotal.lines.covered / cTotal.lines.total) * 100 : 0;
  const stmntsCoverage =
    cTotal.statements.covered !== 0 ? (cTotal.statements.covered / cTotal.statements.total) * 100 : 0;
  const functionsCoverage =
    cTotal.functions.covered !== 0 ? (cTotal.functions.covered / cTotal.functions.total) * 100 : 0;
  const branchCoverage = cTotal.branches.covered !== 0 ? (cTotal.branches.covered / cTotal.branches.total) * 100 : 0;
  const totalAverage = (stmntsCoverage + branchCoverage) / 2;

  return {
    linesCoverage,
    stmntsCoverage,
    functionsCoverage,
    branchCoverage,
    totalAverage,
  };
};

// Display Function
const displaySummary = (cDisplay: DisplayMetrics): void => {
  console.log(
    `============================== Affected apps coverage summary ==============================
  Lines coverage         : ${cDisplay.linesCoverage.toFixed(2)}%
  Statements coverage    : ${cDisplay.stmntsCoverage.toFixed(2)}%
  Functions coverage     : ${cDisplay.functionsCoverage.toFixed(2)}%
  Branches coverage      : ${cDisplay.branchCoverage.toFixed(2)}%
  Total average coverage : ${cDisplay.totalAverage.toFixed(2)}%
============================================================================================`,
  );
};

// File Operations Functions
const readCoverageReports = async (reports: string[]): Promise<string[]> => {
  const reportsPromises = reports.map(f => fs.promises.readFile(f, 'utf8'));
  return Promise.all(reportsPromises);
};

const flatIndividualReports = (reports: CoverageFile[]): Record<string, CoverageMetrics> => {
  const flat: Record<string, CoverageMetrics> = {};
  for (const report of reports) {
    for (const key of Object.keys(report)) {
      if (key !== 'total') {
        flat[key] = report[key];
      }
    }
  }
  return flat;
};

const filterFiles = (reports: CoverageFile[], files: string[]): CoverageMetrics[] => {
  const flattedReports = flatIndividualReports(reports);
  return Object.keys(flattedReports)
    .filter(key => files.includes(key))
    .reduce(
      (previousValue, currentValue) =>
        flattedReports[currentValue] ? [...previousValue, flattedReports[currentValue]] : previousValue,
      [] as CoverageMetrics[],
    );
};

// Command Line Options Parsing
const options = yargs(hideBin(process.argv)).argv as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [keys: string]: any;
} as Options;

if (options['git-diff']) {
  // Process Git Diff Files
  try {
    void (async (): Promise<void> => {
      const gitDiffFileContent = fs.readFileSync('coverage/git-diff.txt');

      const gitDiffFiles = gitDiffFileContent
        .toString()
        .split(/\s/g)
        .filter(str => str.length > 0)
        .filter(str => !str.includes('.spec'))
        .map(str => resolve(str));
      console.log('Running coverage summary for git diff files:');
      console.log(' ' + gitDiffFiles.join('\n ') + '\n');

      const files = sync('coverage/**/coverage-summary.json', {});
      const reports = (await readCoverageReports(files)).map(report => JSON.parse(report) as CoverageFile);
      const selectedFilesMetrics = filterFiles(reports, gitDiffFiles);
      const metrics = computeMetrics(selectedFilesMetrics);
      displaySummary(metrics);
    })();
  } catch (err) {
    console.log(err);
  }
} else {
  // Process Overall Project Coverage
  try {
    void (async (): Promise<void> => {
      const files = sync('coverage/**/coverage-summary.json', {});
      const reports = await readCoverageReports(files);
      const filterTotals = reports.map(report => (JSON.parse(report) as CoverageFile)['total']);
      const metrics = computeMetrics(filterTotals);
      displaySummary(metrics);
    })();
  } catch (err) {
    console.log(err);
  }
}

interface DisplayMetrics {
  linesCoverage: number;
  stmntsCoverage: number;
  functionsCoverage: number;
  branchCoverage: number;
  totalAverage: number;
}

interface CoverageFile {
  [filePath: string]: CoverageMetrics;
}

interface CoverageMetrics {
  lines: MetricsInfo;
  branches: MetricsInfo;
  statements: MetricsInfo;
  functions: MetricsInfo;
}

interface MetricsInfo {
  total: number;
  covered: number;
  skipped?: number;
  pct?: number;
}

interface Options {
  'git-diff': boolean;
}
