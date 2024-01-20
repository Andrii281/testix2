// import { context, getOctokit, core } from '@actions/github';
const github = require('@actions/github');
const { core } = require('@actions/core');

async function run() {
  try {
    const token = getInput('github-token', {
      required: true,
    });
    const message = " ddsfsdfdsf"
    const octokit = github.getOctokit(token);
    const new_comment = await octokit.rest.repos.createCommitComment({
        ...github.context.repo,
        commit_sha: github.context.sha,
        body: message
      });

  } catch (error) {
    
  }
}

run();