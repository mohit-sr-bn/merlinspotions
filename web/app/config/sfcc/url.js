/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import queryString from 'query-string'
import urlParse from 'url-parse'

import Mapper from '../mapper'

const sortMap = {
    'price-low-to-high': 'price-low-to-high',
    'price-high-to-low': 'price-high-to-low',
    'name-ascending': 'name-a-to-z',
    'name-descending': 'name-z-to-a'
}

const filterMap = {
    c_refinementColor: 'refinementColor',
    price: 'price',
    c_isNew: 'isNew'
}

const getMapValue = (map, key, inverse = false) => {
    if (inverse) {
        const inverseMap = {}
        Object.keys(map)
            .forEach((key) => {
                inverseMap[map[key]] = key
            })

        map = inverseMap
    }

    return map[key]
}

export default class SFCCMapper extends Mapper {
    /**
     * Accept search options as we use them in the IM
     * @return url in the format that the desktop website expects.
     */
    getSearchUrl({
        count,
        sort,
        start,
        query,
        filters = {}
    }) {
        const params = []
        const pathname = query ?
            '/Search-Show' :
            `/${filters.cgid}`

        if (count) { params.push(`sz=${count}`) }
        if (sort) { params.push(`srule=${getMapValue(sortMap, sort)}`) }
        if (start) { params.push(`start=${start}`) }
        if (query) { params.push(`q=${query}`) }

        // Compose filters
        let prefCounter = 1
        Object.keys(filters)
            .filter((key) => !['cgid', 'price', 'query'].includes(key))
            .forEach((key) => {
                params.push(`prefn${prefCounter}=${getMapValue(filterMap, key)}&prefv${prefCounter}=${filters[key]}`)
                prefCounter++
            })

        // Compose price
        const {price = ''} = filters
        const priceMatch = price.match(/(\d+)\.\.(\d+)/)
        if (priceMatch) {
            params.push(`pmin=${priceMatch[1]}`)
            params.push(`pmax=${priceMatch[2]}`)
        }

        return `${this.baseUrl}${pathname}?${params.sort().join('&')}`
    }

    parseSearchUrl(url) {
        const urlObj = urlParse(url)
        const {query, pathname} = urlObj
        const queryObj = queryString.parse(query)

        const categoryId = pathname.split('/').pop()

        const filters = {}
        if (categoryId && categoryId !== 'Search-Show') {
            filters.cgid = categoryId
        }

        // Parse Salesforce url refinements (defined as prefn and prefv respectfully)
        Object.keys(queryObj)
            .filter((key) => /^prefn/.test(key))
            .forEach((key) => {
                filters[getMapValue(filterMap, queryObj[key], true)] = queryObj[key.replace('prefn', 'prefv')]
            })

        // Salesforce uses different syntax for price refinements, parse them here.
        const {pmin, pmax} = queryObj
        if (pmin && pmax) {
            filters.price = `(${pmin}..${pmax})`
        }

        return {
            count: queryObj.sz ? parseInt(queryObj.sz) : undefined,
            start: queryObj.start ? parseInt(queryObj.start) : undefined,
            sort: getMapValue(sortMap, queryObj.srule, true),
            filters,
            query: queryObj.q
        }
    }
}
