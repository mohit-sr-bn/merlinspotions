/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import queryString from 'query-string'
import urlParse from 'url-parse'

import Mapper from '../mapper'
import {DEFAULT_PAGE_SIZE} from './constants'

export default class MerlinsMapper extends Mapper {
    /**
     * Accept search options as we use them in the IM
     * @return url in the format that the desktop website expects.
     */
    getSearchUrl({
        count,
        sort,
        start,
        total,
        query,
        filters = {}
    }) {

        const params = []
        const pathname = query ?
            '/catalogsearch/result/' :
            `/${filters.cgid}.html`

        if (count) { params.push(`product_list_limit=${count}`) }
        if (total) { params.push(`product_list_total=${total}`) }
        if (sort) { params.push(`product_list_order=${sort}`) }
        if (start) { params.push(`p=${Math.ceil(total / start)}`) }
        if (query) { params.push(`q=${query}`) }

        // Compose the filters part of the url
        Object.keys(filters)
            .filter((key) => !['cgid'].includes(key))
            .forEach((key) => {
                params.push(`${key}=${filters[key]}`)
            })

        return `${this.baseUrl}${pathname}?${params.sort().join('&')}`
    }

    parseSearchUrl(url) {

        const urlObj = urlParse(url)
        const {query, pathname} = urlObj
        const queryObj = queryString.parse(query)
        const idMatch = pathname.match(/\/(.+)\.html/)
        const id = idMatch && idMatch[1]

        const filters = {}
        if (id !== 'Search-Show') {
            filters.cgid = id
        }

        const magentoRefinments = ['color', 'price']

        Object.keys(queryObj)
            .filter((key) => magentoRefinments.includes(key))
            .forEach((key) => {
                filters[key] = queryObj[key]
            })

        const count = queryObj.product_list_limit ? parseInt(queryObj.product_list_limit) : DEFAULT_PAGE_SIZE
        const total = queryObj.product_list_total ? parseInt(queryObj.product_list_total) : undefined
        const start = queryObj.p ? (parseInt(queryObj.p) - 1) * DEFAULT_PAGE_SIZE : 0

        return {
            count,
            filters,
            query: queryObj.q,
            start,
            sort: queryObj.product_list_order,
            total
        }
    }
}
