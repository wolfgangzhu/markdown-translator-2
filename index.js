const chunk = require('lodash.chunk')
const flatten = require('lodash.flatten')
const fs = require('fs')

const {
  parseToTree,
  getTextTobeTranslated,
  stringifyToDoc,
} = require('./lib/parseMarkdown')
const { translate } = require('./lib/translateByMicrosoft')

module.exports = ({ src, text, from, to, subscriptionKey, region }) => {
  return new Promise((resolve, reject) => {
    const tree = parseToTree({ src, text })
    const nodeArr = getTextTobeTranslated(tree).sort((a, b) => a.type.localeCompare(b.type)).reverse();

    const textArr = nodeArr.reduce((prev = [], cur) => {
      if (cur && cur.value && cur.type === 'text') {
        prev.push({
          text: cur.value,
        })
      }
      return prev
    }, [])

    const htmlArray = nodeArr.reduce((prev = [], cur) => {
      if (cur && cur.value && cur.type === 'html') {
        prev.push({
          text: cur.value,
        })
      }
      return prev
    }, [])

    const chunkTextArr = chunk(textArr, 100)
    const htmlTextArr = chunk(htmlArray, 100)

    const translatePromises = []

    for (let eachTextArr of chunkTextArr) {
      translatePromises.push(
        translate(eachTextArr, {
          from,
          to,
          subscriptionKey,
          region,
        }, "plain")
      )
    }

    for (let eachTextArr of htmlTextArr) {
      translatePromises.push(
        translate(eachTextArr, {
          from,
          to,
          subscriptionKey,
          region,
        }, "html")
      )
    }

    Promise.all(translatePromises)
      .then((dataArr) => {
        let data = flatten(dataArr)
        for (let node of nodeArr) {
          if (node && node.value) {
            const result = data.shift()
            if (result && result.translations) {
              node.value = result.translations[0].text
            }
          }
        }
        resolve(stringifyToDoc(tree))
      })
      .catch(reject)
  })
}
