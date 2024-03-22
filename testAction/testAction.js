import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'

/**
 * Get all git tags
 *
 * @returns {null || String} all tags text
 */
export async function getGitTagList () {
  let list = ''
  const options = {
    silent: true,
    listeners: {
      stdout: data => {
        // append command response
        list += data.toString()
      },
      debug: data => {
        core.debug(data.toString())
      }
    }
  }

  // execute failed will be non-zero value
  const result = await exec.exec('git tag', null, options)

  core.warning('result\n' + result.toString())
  core.warning(typeof result)
  core.warning(result)
  core.warning('list\n' + list)

  if (result !== 0) {
    list = null
  }

  return list
}

async function mainProcess () {
  // obtain data first
  // NOTE: Will throw if get data failed and required true.
  const ownerName = core.getInput('owner', {required: true})
  const ghToken = core.getInput('token', {required: true})

  core.debug(`enos owner name ${ownerName}`)

  // login SDK
  const octokit = github.getOctokit(ghToken)

  let response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner: ownerName,
    repo: 'playground',
    state: 'all',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  const issueList = response?.data

  core.debug(`Response: ${response}`)
  core.debug(`Issue list: ${issueList}`)

  console.log(`Issue list: ${issueList}`)

  const issueOptions = {
    owner: ownerName,
    repo: 'playground',
    issue_number: 3,
    body: 'test'
  }

  response = await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}',
    issueOptions)

  core.debug(`Response: ${response}`)

  const list = await getGitTagList()
  if (list) {
    core.debug('list obtained' + list)
  } else {
    core.error('failed')
  }
}

// execute point
mainProcess()
  .catch(err => {
    core.setFailed(err.message)
    process.exit(1)
  })
