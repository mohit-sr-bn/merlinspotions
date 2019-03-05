/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jquery, jest, node */
import {jquerifyHtmlFile} from 'progressive-web-sdk/dist/test-utils'
import {parseCategory} from './parser'

describe('the category parser', () => {
    const $content = jquerifyHtmlFile(`${__dirname}/parser.test.html`)
    const parsedContent = parseCategory($, $content)

    it('should extract the category content from the rendered HTML', () => {
        const expected = {
            id: 'potions',
            title: 'Potions',
            href: '',
            url: '',
            pageMeta: {
                description: `Welcome to Merlin's Potions. Camelot's number 1 online supplier of potions, books, ingredients and more`,
                keywords: '',
                title: 'Potions'
            },
            parentId: 'home'
        }

        // Test that the shallow properties of the product list object are correct
        for (const key in parsedContent) {
            if (Object.prototype.hasOwnProperty.call(parsedContent, key)) {
                expect(parsedContent[key]).toEqual(expected[key])
            }
        }
    })
})
