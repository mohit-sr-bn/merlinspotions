/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {hasAMPPage} from './ampUrls'

describe('Validates correct amp routes', () => {

    test('Accepts valid route to a PLP', () => {
        const valid = [
            '/potions.html',
            '/ingredients.html'
        ]
        valid.forEach((url) => { expect(hasAMPPage(url)).toBe(true) })
    })

    test('Rejects invalid route to a PLP', () => {
        const invalid = [
            '/s/lancome-us/potato/invalid',
            '/invalidmakeup/',
            '/s/lancome-uk/search/rando',
            '/accessories.html'
        ]
        invalid.forEach((url) => { expect(hasAMPPage(url)).toBe(false) })
    })

    test('Accepts valid route to a PDP', () => {
        const valid = [
            '/eye-of-newt.html',
            '/unicorn-blood.html',
            '/potions/eye-of-newt.html'
        ]
        valid.forEach((url) => { expect(hasAMPPage(url)).toBe(true) })
    })

    test('Rejects invalid route to a PDP', () => {
        const invalid = [
            '/s/lancome-us/invalid/test.html?x=123',
            '/makeup/LAN1312.html',
            '/en_FR/fragrance/typeofpotion/potions.html',
            '/hersheys.html?val=unacceptable',
            '/dracula-drool.html'
        ]
        invalid.forEach((url) => { expect(hasAMPPage(url)).toBe(false) })
    })
})
