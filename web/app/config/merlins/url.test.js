/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jquery, jest */

import MerlinMapper from './url'
import urlMapper, {getRouteFromUrl} from '../url-mapper'
import {DEFAULT_PAGE_SIZE} from './constants'

test('Merlin should be mapping correctly', () => {
    urlMapper.initialize(MerlinMapper)

    expect(
        urlMapper.parseSearchUrl(`https://www.merlinspotions.com/catalogsearch/result/?q=test`)
    ).toEqual(
        {count: DEFAULT_PAGE_SIZE, filters: {cgid: null}, query: 'test', sort: undefined, start: 0}
    )

    expect(
        urlMapper.getSearchUrl({query: 'test'})
    ).toBe(
        '/catalogsearch/result/?q=test'
    )

    expect(
        getRouteFromUrl(urlMapper.getSearchUrl({query: 'test'}))
    ).toEqual(
        {
            pathname: '/catalogsearch/result/',
            query: {q: 'test'}
        }
    )
})

test('Merlin should be mapping correctly with baseUrl', () => {
    urlMapper.initialize(MerlinMapper, {
        baseUrl: 'https://www.merlinspotions.com'
    })

    expect(
        urlMapper.getSearchUrl({query: 'test'})
    ).toBe(
        'https://www.merlinspotions.com/catalogsearch/result/?q=test'
    )

    expect(
        getRouteFromUrl(urlMapper.getSearchUrl({query: 'test'}))
    ).toEqual(
        {
            pathname: '/catalogsearch/result/',
            query: {q: 'test'}
        }
    )
})
