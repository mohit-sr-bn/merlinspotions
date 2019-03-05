/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

// From https://github.com/mobify/capturejs/blob/master/src/capture.js

const Utils = {}
Utils.keys = function(obj) {
    const result = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result.push(key)
        }
    }
    return result
}

// Map of all attributes we should disable (to prevent resources from downloading)
const disablingMap = {
    img: ['src', 'srcset'],
    source: ['src', 'srcset'],
    iframe: ['src'],
    script: ['src', 'type'],
    link: ['href'],
    style: ['media'],
}

const openingScriptRe = /(<script[\s\S]*?>)/gi

// Inline styles and scripts are disabled using a unknown type.
const tagDisablers = {
    style: ' media="mobify-media"',
    script: ' type="text/mobify-script"'
}

const affectedTagRe = new RegExp(`<(${Utils.keys(disablingMap).join('|')})([\\s\\S]*?)>`, 'gi')
const attributeDisablingRes = {}
const attributesToEnable = {}

// Populate `attributesToEnable` and `attributeDisablingRes`.
for (const tagName in disablingMap) {
    if (!disablingMap.hasOwnProperty(tagName)) {
        continue
    }

    const targetAttributes = disablingMap[tagName]

    targetAttributes.forEach((value) => {
        attributesToEnable[value] = true
    })

    // <space><attr>='...'|"..."
    attributeDisablingRes[tagName] = new RegExp(
        `\\s+((?:${targetAttributes.join('|')})\\s*=\\s*(?:('|")[\\s\\S]+?\\2))`, 'gi')
}

/**
 * Returns a string with all external attributes disabled.
 * Includes special handling for resources referenced in scripts and inside
 * comments.
 * Not declared on the prototype so it can be used as a static method.
 */
const captureDisable = function(htmlStr, prefix) {
    // Disables all attributes in disablingMap by prepending prefix
    const disableAttributes = (() => {
        return function(whole, tagName, tail) {
            const lowercaseTagName = tagName.toLowerCase()
            return `<${lowercaseTagName}${(tagDisablers[lowercaseTagName] || '')}
                ${tail.replace(attributeDisablingRes[lowercaseTagName], ` ${prefix}$1`)}>`
        }
    })()

    const splitRe = /(<!--[\s\S]*?-->)|(?=<\/script)/i
    const tokens = htmlStr.split(splitRe)
    const ret = tokens.map((fragment) => {
        // Fragment may be empty or just a comment, no need to escape those.
        if (!fragment) {
            return ''
        }

        if (/^<!--/.test(fragment)) {
            return fragment
        }

        // Disable before and the <script> itself.
        // parsed = [before, <script>, script contents]
        const parsed = fragment.split(openingScriptRe)
        parsed[0] = parsed[0].replace(affectedTagRe, disableAttributes)
        if (parsed[1]) {
            parsed[1] = parsed[1].replace(affectedTagRe, disableAttributes)
        }
        return parsed
    })

    return [].concat(...ret).join('')
}

export const jqueryResponse = (window) => (response) => response.text()
    .then((responseText) => {
        const transformedText = captureDisable(responseText, 'x-')

        const iframe = window.document.createElement('iframe')
        iframe.style.display = 'none'
        window.document.body.appendChild(iframe)

        const doc = iframe.contentDocument
        doc.open()
        doc.write(transformedText)
        doc.close()

        window.setTimeout(() => {
            iframe.remove()
        }, 0)

        const jQueryObject = window.$(doc.documentElement)

        return [window.$, jQueryObject]
    })
