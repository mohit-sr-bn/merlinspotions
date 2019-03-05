/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jquery, jest */

import SFCCMapper from './url.js'
import urlMapper from '../url-mapper'

test('SFCC should be mapping correctly', () => {
    urlMapper.initialize(SFCCMapper)

    expect(
        urlMapper.parseSearchUrl(`/Search-Show?q=test`)
    ).toEqual(
        {count: undefined, filters: {}, query: 'test', sort: undefined, start: undefined}
    )

    expect(
        urlMapper.getSearchUrl({query: 'test'})
    ).toBe(
        '/Search-Show?q=test'
    )
})
