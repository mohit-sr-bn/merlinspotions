/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {createSelector} from 'reselect'
import {pathFromURL} from '../../utils'
import * as navSelectors from 'web/app/modals/navigation/selectors'

const convertPaths = (node) => Object.assign({}, node, {
    children: node.children && node.children.map(convertPaths),
    path: node.path && pathFromURL(node.path)
})

/**
 * Return the navigation root with paths replaced with their AMP-equivalents
 */
export const getNavigationRoot = createSelector(navSelectors.getNavigationRoot, (root) => {
    return Immutable.fromJS(convertPaths(root.toJS()))
})

/**
 * Return the AMP version of the current path
 */
export const getPath = createSelector(navSelectors.getPath, (url) => pathFromURL(url))
