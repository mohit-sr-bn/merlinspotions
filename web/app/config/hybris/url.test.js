/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jquery, jest */

import HybrisMapper from './url.js'
import urlMapper from '../url-mapper'
import {ITEMS_PER_PAGE} from '../../containers/product-list/constants'

test('Hybris should be mapping correctly', () => {
    urlMapper.initialize(HybrisMapper)

    expect(
        urlMapper.parseSearchUrl(`/c/22000?q=%3Arelevance%3Aprice%3A%25C2%25A30-%25C2%25A319.99&page=1`)
    ).toEqual({
        count: ITEMS_PER_PAGE,
        filters: {
            cgid: '22000',
            price: '%C2%A30-%C2%A319.99'
        },
        query: ':relevance:price:%C2%A30-%C2%A319.99',
        sort: 'relevance',
        start: 1
    })

    expect(
        urlMapper.getSearchUrl({sort: 'top-rated', start: 0, count: ITEMS_PER_PAGE})
    ).toMatch(/\?page=0&sort=top-rated/)
})
