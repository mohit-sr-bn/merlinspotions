/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import queryString from 'query-string'
import urlParse from 'url-parse'

/**
 * Return an object for browserHistory.push
 * @param {String} url
 * @return {Object} An object containing pathname and query
 */
export const getRouteFromUrl = (url) => {
    const urlObj = urlParse(url)
    const {query, pathname} = urlObj
    return {
        pathname,
        query: queryString.parse(query)
    }
}

class UrlMapper {
    initialize(mapper, options = {}) {
        const urlMapper = new mapper(options)
        Object.assign(this, urlMapper)
    }
}

const mapper = new UrlMapper()

export default mapper
