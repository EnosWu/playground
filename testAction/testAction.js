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

  if (result !== 0) {
    list = null
  }

  return list
}

async function mainProcess () {
  // obtain data first
  // NOTE: Will throw if get data failed and required true.
  const ownerName = core.getInput('owner', {required: true})

  core.debug(`enos owner name ${ownerName}`)

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
