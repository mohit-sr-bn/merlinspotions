/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jquery, jest */

import StubMapper from './url.js'
import urlMapper from '../url-mapper'

test('stub should be mapping correctly', () => {
    urlMapper.initialize(StubMapper)

    expect(
        urlMapper.parseSearchUrl(`/search?q=test`)
    ).toEqual({
        count: 10,
        start: 0,
        sort: 'name-descending',
        filters: {
            cgid: 'newarrivals'
        }
    })

    expect(
        urlMapper.getSearchUrl()
    ).toBe(
        '/search'
    )
})
