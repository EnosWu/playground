import * as core from '@actions/core'
import * as github from '@actions/github'

async function mainProcess () {
  // obtain data first
  // NOTE: Will throw if get data failed and required true.
  const ownerName = core.getInput('owner', {required: true})

  core.debug(`enos owner name ${ownerName}`)
}

// execute point
mainProcess()
  .catch(err => {
    core.setFailed(err.message)
    process.exit(1)
  })
