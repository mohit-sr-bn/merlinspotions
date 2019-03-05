/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {getCurrentPageNumberFromUrl, getPaginationHref} from './product-list-contents.jsx'

test('Current page number from url works with number', () => {
    expect(getCurrentPageNumberFromUrl('https://www.merlinspotions.com/potions.html?p=1', 5)).toBe(1)
    expect(getCurrentPageNumberFromUrl('https://www.merlinspotions.com/potions.html?p=2', 5)).toBe(2)
})

test('Current page number from url works with no parameter', () => {
    expect(getCurrentPageNumberFromUrl('https://www.merlinspotions.com/potions.html', 5)).toBe(1)
})

test('Appropriate pagination href generated for next page', () => {
    expect(getPaginationHref(1, 'https://www.merlinspotions.com/potions.html?p=1', 5))
    .toBe('https://www.merlinspotions.com/potions.html?p=2')

    expect(getPaginationHref(1, 'https://www.merlinspotions.com/potions.html?p=5', 5))
    .toBe(null)

    expect(getPaginationHref(1, 'https://www.merlinspotions.com/potions.html', 5))
    .toBe('https://www.merlinspotions.com/potions.html?p=2')
})

test('Appropriate pagination href generated for prev page', () => {
    expect(getPaginationHref(-1, 'https://www.merlinspotions.com/potions.html?p=1', 5))
    .toBe(null)

    expect(getPaginationHref(-1, 'https://www.merlinspotions.com/potions.html?p=5', 5))
    .toBe('https://www.merlinspotions.com/potions.html?p=4')

    expect(getPaginationHref(-1, 'https://www.merlinspotions.com/potions.html', 5))
    .toBe(null)
})
