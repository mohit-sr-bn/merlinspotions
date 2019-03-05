/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Mapper from '../mapper'

export default class StubMapper extends Mapper {
    /**
     * Accept search options as we use them in the IM
     * @return url in the format that the desktop website expects.
     */
    getSearchUrl() { return `${this.baseUrl}/search` }

    /**
     * Accept a url
     * @return and object representing a searchParam
     */
    parseSearchUrl() {
        return {
            count: 10,
            start: 0,
            sort: 'name-descending',
            filters: {
                cgid: 'newarrivals'
            }
        }
    }
}
