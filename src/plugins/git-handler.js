const git = require('simple-git/promise')

async function status(workingDir) {
    let statusSummary = null;
    try {
        statusSummary = await git(workingDir).status();
    } catch (error) {
        console.log(error)
    }
    return statusSummary;
}

async function add(workingDir, files) {
    let addAllSummary = null;
    try {
        addAllSummary = await git(workingDir).add(files)
    } catch (error) {
        console.log(error)
    }
    return addAllSummary
}

async function push(workingDir) {
    let pushSummary = null;
    try {
        pushSummary = await git(workingDir).push(['origin', 'master'])
        console.log(pushSummary)
    } catch (error) {
        console.log(error)
    }
    return pushSummary
}

module.exports.status = status
module.exports.add = add
module.exports.push = push