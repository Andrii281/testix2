import { context, getOctokit, core } from '@actions/github';

async function run() {
  try {
    const token = getInput('github-token', {
      required: true,
    });
    const message = " ddsfsdfdsf"
    const octokit = getOctokit(token);
    const new_comment = await octokit.rest.repos.createCommitComment({
        ...context.repo,
        commit_sha: context.sha,
        body: message
      });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();