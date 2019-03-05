/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import template from '../../template'
import {initialize} from './actions'
import WishlistContents from './partials/wishlist-contents'
import WishlistHeader from './partials/wishlist-header'

const Wishlist = () => (
    <div className="t-wishlist">
        <WishlistHeader />
        <WishlistContents />
    </div>
)

Wishlist.propTypes = {
    itemCount: PropTypes.number,
    title: PropTypes.string
}

Wishlist.initAction = initialize

export default template(Wishlist)
