const fs = require('fs')

function updateTitle(mdFilePath, newtitle) {
    let originalText = fs.readFileSync(mdFilePath, { encoding: 'utf-8'})
    // console.log(originalText.replace(/title: ?.*/, `title: ${newtitle}`))
}

module.exports.updateTitle = updateTitle 