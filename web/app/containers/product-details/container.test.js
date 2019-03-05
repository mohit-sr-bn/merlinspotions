/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
/* eslint-disable import/namespace */

import {shallow} from 'enzyme'
import React from 'react'

import ConnectedProductDetails from './container'

const ProductDetails = ConnectedProductDetails.WrappedComponent.WrappedComponent

const PROPS = {
    breadcrumbs: [{text: 'Home', href: '/'}, {text: '...'}],
    cartURL: '/cart/',
    wishlistURL: '/wishlist/'
}

const ROUTE = {
    routeName: 'pdp'
}


describe('The product details page', () => {
    test('doesnt render the breadcrumbs if running in Astro', () => {
        const productDetails = shallow(<ProductDetails isRunningInAstro={true} route={ROUTE} {...PROPS} />)
        const breadcrumbs = productDetails.find(`.t-product-details__breadcrumbs`)
        expect(breadcrumbs.length).toBe(0)
    })

    test('renders the breadcrumbs if not running in Astro', () => {
        const productDetails = shallow(<ProductDetails isRunningInAstro={false} route={ROUTE} {...PROPS} />)

        const breadcrumbs = productDetails.find(`.t-product-details__breadcrumbs`)
        expect(breadcrumbs.length).toBe(1)
    })
})
