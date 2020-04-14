const yaml = require('js-yaml')

let shortMsgLine = 10

var catesTree = []

// node = {
//     name
//     childNodes
//     parentNode
// }

function findNode(cateNodeName) {
    return catesTree.find((value) => {
        return value.name === cateNodeName
    })
}

var tags = []

var seriesMap = new Map()
function findSeries(title) {
    for (const seriesName of seriesMap.keys()) {
        for (const seriesTitle of seriesMap.get(seriesName)) {
            if (seriesTitle === title)
                return seriesName
        }
    }
}

function syncreihandle2metadata(text) {
    let endIndex = text.indexOf('---', 3) + 3
    let metadata = text.substring(4, endIndex - 3)
    metadata = yaml.safeLoad(metadata)
    let body = text.substring(endIndex, text.length)
    metadata.char_count = body.length

    // handle cates tree
    for (let i = 0; i < metadata.categories.length; i++) {
        let cateNodeName = metadata.categories[i]
        let newNode = findNode(cateNodeName) === undefined
        if (i === 0 && newNode) {
            catesTree.push({
                name: cateNodeName,
                childNodes: [],
                parentNode: null
            })
        }
        if (i > 0 && newNode) {
            let parentNode = findNode(metadata.categories[i - 1])
            newNode = {
                name: cateNodeName,
                childNodes: [],
                parentNode: parentNode
            }
            catesTree.push(newNode)
            parentNode.childNodes.push(newNode)
        }
    }

    // handle tags
    for(let i = 0; metadata.tags !== undefined && i < metadata.tags.length; i++) {
        let tagName = metadata.tags[i]
        if (tags.find((t) => {
            return t === tagName
        }) === undefined) {
            tags.push(tagName)
        }
    }

    // handle series
    if (metadata.series !== undefined) {
        let v  = seriesMap.get(metadata.series)
        if (v === undefined) {
            v = []
            seriesMap.set(metadata.series, v)
        }
        v.push(metadata.title)
    }

    // handle short_content
    let short = new Array()
    if (body.trim().length > 0) {
        body = body.split(/\n/)
        for (let i = 0; i < shortMsgLine; i++) {
            short.push(body[i])
        }
        while (short[0] === '\n') {
            short.shift()
        }
        let shortContent = ''
        let codePareCount = 0
        let startPreIndex = -1
        let endPreIndex = -1
        for (let j = 0; j < short.length; j++) {
            if (short[j].search('```') === 0) {
                codePareCount++
            }
            let presi = short[j].search('<pre')
            let preei = short[j].search('</pre')
            startPreIndex = presi !== -1 ? presi : startPreIndex
            endPreIndex = preei !== -1 ? preei : endPreIndex
            shortContent += short[j]
            shortContent += '\n'
        }
        if (codePareCount % 2 !== 0) {
            shortContent += '```'
            shortContent += '\n'
        }
        if (startPreIndex !== -1 && endPreIndex < startPreIndex) {
            for (let i = shortMsgLine; endPreIndex < startPreIndex; i++) {
                if (i == 35) {
                    shortContent += '</pre>'
                    shortContent += '\n'
                    break
                }
                endPreIndex = body[i].search('</pre')
                shortContent += body[i]
                shortContent += '\n'
            }
        }
        metadata.short_content = shortContent.replace(/!\[.*\]\(.*\)/gm, '')
    }
    return metadata
}

function extract(sourceMdStr) {
    let metadata
    try {
        metadata = syncreihandle2metadata(sourceMdStr)
    } catch (error) {
        console.log(error)
        return
    }
    let endIndex = sourceMdStr.indexOf('---', 3) + 3
    let body = sourceMdStr.substring(endIndex, sourceMdStr.length)
    return {
        metadata: metadata,
        body: body
    }
}

module.exports.extract = extract
module.exports.catesTree = catesTree
module.exports.findNode = findNode
module.exports.tags = tags
module.exports.seriesMap = seriesMap
module.exports.findSeries = findSeries