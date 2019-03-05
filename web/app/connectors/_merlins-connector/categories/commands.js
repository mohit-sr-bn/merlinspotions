/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {fetchPageData} from '../app/commands'
import {receiveCategoryInformation} from 'mobify-integration-manager/dist/integration-manager/api/categories/results'

import {parseCategory} from './parser'

export const getCategory = (id, opts) => (dispatch) => { // eslint-disable-line no-unused-vars
    const {url} = opts
    return dispatch(fetchPageData(url))
        .then(([$, $response]) => parseCategory($, $response)) // eslint-disable-line no-unused-vars
        .then((category) => dispatch(receiveCategoryInformation(category.id, category)))
}
