const fs = require('fs')
const path = require('path')

function update(mdFilePath, data) {
    let originalText = fs.readFileSync(mdFilePath, { encoding: 'utf-8'})
    let newText = originalText
    if (data.newArticleTitle !== undefined) {
        newText = newText.replace(/title:\s*.*\s*[\n|\r|\r\n]/, `title: ${data.newArticleTitle}\n`)
    }
    if (data.newArticleCates !== undefined) {
        let newArticleCatesText = 'categories:\n'
        data.newArticleCates.forEach((c) => {
            newArticleCatesText += `  - ${c}\n`
        })
        newText = newText.replace(/categories:\s*[\n|\r|\r\n](\s\s\-\s.*\s*[\n|\r|\r\n])*/, newArticleCatesText)
    }
    if (data.newArticleTags !== undefined) {
        let newArticleTagsText = 'tags:\n'
        data.newArticleTags.forEach((c) => {
            newArticleTagsText += `  - ${c}\n`
        })
        newText = newText.replace(/tags:\s*[\n|\r|\r\n](\s\s\-\s.*\s*[\n|\r|\r\n])*/, newArticleTagsText)
    }
    fs.writeFileSync(mdFilePath, newText, { encoding: 'utf-8'})
    if (data.newArticleTitle !== undefined) {
        fs.renameSync(mdFilePath, path.join(path.dirname(mdFilePath), data.newArticleTitle + '.md'))
    }
}

function create(mdFilePath, data) {
    let newArticle = `---\ntitle: ${data.title}\n`
    newArticle += 'categories:\n'
    if (data.categories.length === 0) {
        newArticle += `  - essay\n`
    } else {
        data.categories.forEach(ca => {
            newArticle += `  - ${ca}\n`
        })
    }
    newArticle += 'tags:\n'
    if (data.tags.length === 0) {
        newArticle += `  - nottag\n`
    } else {
        data.tags.forEach(tg => {
            newArticle += `  - ${tg}\n`
        })
    }
    let now = new Date()
    newArticle += `date: ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\n---`
    fs.writeFileSync(mdFilePath, newArticle, {encoding:'utf-8'})
}

module.exports.update = update 
module.exports.create = create