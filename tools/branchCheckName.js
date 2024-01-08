// eslint-disable-next-line
const child_process = require("child_process");

const { GITHUB_HEAD_REF } = process.env;
const branchName =
  GITHUB_HEAD_REF ?? child_process.execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"]).toString().trim();

// eslint-disable-next-line
(function () {
  const error = lintBranchName(branchName);

  if (error !== null) {
    // eslint-disable-next-line
    console.error(`${error}\nbranch name: \"${branchName}\" is forbidden`);
    process.exit(1);
  }
})();

function lintBranchName(branchNameToCheck) {
  const whiteListCheck = branchNameToCheck.match(/^(main|develop)$/);

  if (whiteListCheck !== null) {
    return null;
  }

  const branchStartNameCheck = branchNameToCheck.match(/^(PILLP-\d+){1}/);

  if (branchStartNameCheck === null) {
    return "Branch name must start with PILLP-$(TASK_NUMBER): PILLP-1_project_deploy";
  }

  const [prefix] = branchStartNameCheck;
  const bodyOfBranchName = branchNameToCheck.substring(prefix.length);
  const snakeCaseCheck = bodyOfBranchName.match(/^(_[a-z0-9]+){1,}$/);

  if (snakeCaseCheck === null) {
    return "Body of branch name should be in the snake_case lowercase format: PILLP-1_project_deploy";
  }

  return null;
}