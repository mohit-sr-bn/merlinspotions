/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'

const NoWishlistItems = () => (
    <div className="t-wishlist__empty u-padding-md u-flexbox u-direction-column u-align-center u-justify-center">
        <Icon
            name="wishlist-add"
            className="u-color-brand"
            size="huge"
        />
        <div className="u-text-align-center u-padding-lg">
            You have no items in your wishlist.
            Start adding items by browsing the product catalogue
        </div>
        <Button text="Continue Shopping" href="/" className="pw--tertiary u-width-full u-text-uppercase " />
    </div>
)

export default NoWishlistItems
