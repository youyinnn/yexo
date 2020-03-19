const fs = require('fs')
const path = require('path')

function update(mdFilePath, data) {
    let originalText = fs.readFileSync(mdFilePath, { encoding: 'utf-8'})
    let newText = originalText
    if (data.newArticleTitle !== undefined) {
        newText = newText.replace(/title: ?.*[\n|\r|\r\n]/, `title: ${data.newArticleTitle}\r`)
    }
    if (data.newArticleCates !== undefined) {
        let newArticleCatesText = 'categories: \r'
        data.newArticleCates.forEach((c) => {
            newArticleCatesText += `  - ${c}\r`
        })
        newText = newText.replace(/categories:\s*[\n|\r|\r\n](\s\s\-\s*.*[\n|\r|\r\n])*/, newArticleCatesText)
    }
    if (data.newArticleTags !== undefined) {
        let newArticleTagsText = 'tags: \r'
        data.newArticleTags.forEach((c) => {
            newArticleTagsText += `  - ${c}\r`
        })
        newText = newText.replace(/tags:\s*[\n|\r|\r\n](\s\s\-\s*.*[\n|\r|\r\n])*/, newArticleTagsText)
    }
    fs.writeFileSync(mdFilePath, newText, { encoding: 'utf-8'})
    if (data.newArticleTitle !== undefined) {
        fs.renameSync(mdFilePath, path.join(path.dirname(mdFilePath), data.newArticleTitle + '.md'))
    }
}

module.exports.update = update 