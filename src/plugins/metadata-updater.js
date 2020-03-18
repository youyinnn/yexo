const fs = require('fs')

function update(mdFilePath, data) {
    console.log(data)
    let originalText = fs.readFileSync(mdFilePath, { encoding: 'utf-8'})
    let newText = originalText
    if (data.newArticleTitle !== undefined) {
        newText = newText.replace(/title: ?.*/, `title: ${data.newArticleTitle}`)
    }
    if (data.newArticleCates !== undefined) {
        let newArticleCatesText = 'categories: \n'
        data.newArticleCates.forEach((c) => {
            newArticleCatesText += `  - ${c}\n`
        })
        newText = newText.replace(/categories:\s*[\n|\r|\r\n](\s\s\-\s*.*[\n|\r|\r\n])*/, newArticleCatesText.substring(0, newArticleCatesText.length - 1))
    }
    if (data.newArticleTags !== undefined) {
        let newArticleTagsText = 'tags: \n'
        data.newArticleTags.forEach((c) => {
            newArticleTagsText += `  - ${c}\n`
        })
        newText = newText.replace(/tags:\s*[\n|\r|\r\n](\s\s\-\s*.*[\n|\r|\r\n])*/, newArticleTagsText.substring(0, newArticleTagsText.length - 1))
    }
    console.log(newText)
}

module.exports.update = update 