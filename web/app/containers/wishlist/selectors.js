/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import Immutable from 'immutable'
import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import {getUi} from '../../store/selectors'

export const getWishlist = createSelector(
    getUi,
    ({wishlist}) => wishlist
)

export const getWishlistPageMeta = createGetSelector(getWishlist, 'pageMeta', Immutable.Map())

export const getContentLoaded = createGetSelector(getWishlist, 'contentLoaded', false)

export const getWishlistItemQuantity = createGetSelector(getWishlist, 'itemQuantity')

export const getRemoveWishlistItemData = createGetSelector(getWishlist, 'removeWishlistItemData')
