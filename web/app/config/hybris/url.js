/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import queryString from 'query-string'
import urlParse from 'url-parse'

import {ITEMS_PER_PAGE} from '../../containers/product-list/constants'

import Mapper from '../mapper'

const destructQueryObject = (queryString = '') => {
    return queryString.split(':').filter((q) => q.length > 0)
}

const constructFilters = (queryArray = []) => {
    const filters = {}
    queryArray.forEach((element, index) => {
        if (index % 2 === 0) {
            filters[element] = queryArray[index + 1]
        }
    })
    return filters
}

export default class HybrisMapper extends Mapper {
    getSearchUrl({
        sort = 'relevance',
        filters = {},
        count,
        start,
    }) {
        const params = []
        const {origin, pathname} = window.location

        if (sort) { params.push(`sort=${sort}`) }
        const q = []
        if (filters) {
            Object.keys(filters)
                .filter((key) => !['cgid', 'query'].includes(key))
                .forEach((key) => {
                    // Hybris uses a different code for store filters
                    const value = filters[key]
                    if (key === 'stores') {
                        key = 'availableInStores'
                    }
                    q.push(`${key}:${value}`)
                })

            if (q.length > 0) {
                params.push(`q=:${q.join(':')}`)
            }
        }
        const page = parseInt(start / count)
        params.push(`page=${page}`)

        return `${origin}${pathname}?${params.sort().join('&')}`
    }

    parseSearchUrl(url) {
        // Hybris Desktop URL filters has the following queryformats
        // 1. ?q=:sortName:filter1:value1:filter2:value2:filter3:value3
        // 2. ?sort=sortName&q=:filter1:value1:filter2:value2:filter3:value3

        const urlObj = urlParse(url)
        const {query, pathname} = urlObj
        const queryObj = queryString.parse(query)
        const queryArray = destructQueryObject(queryObj.q)
        const categoryId = pathname.split('/').pop()

        let sort
        if (queryObj.sort) {
            sort = queryObj.sort
        } else if ((queryArray.length % 2) !== 0) { // Check if the array length is odd, if it is, then the first one is the selected sort
            sort = queryArray.shift()
        } else {
            sort = 'relevance'
        }
        const page = parseInt(queryObj.page)
        const filters = constructFilters(queryArray)
        filters.cgid = categoryId
        return {
            count: ITEMS_PER_PAGE,
            start: page ? page : 0,
            sort,
            filters,
            query: queryObj.q
        }
    }
}
