/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import React from 'react'
import Immutable from 'immutable'
import {mount, shallow} from 'enzyme'
import ConnectedCartProductList from './cart-product-list'
import {
    wrapProviderIntlProvider,
    intlContext,
    currencyObject
} from '../../../utils/test-utils'

const CartProductList = ConnectedCartProductList.WrappedComponent

const store = {
    app: Immutable.fromJS({
        selectedCurrency: currencyObject,
        availableCurrencies: [currencyObject],
    }),
    ui: { // Note: This can't be immutable, otherwise it breaks UI selectors...
        app: Immutable.fromJS({
            translations: {},
            locale: 'en'
        })
    },
}

test('renders without errors', () => {
    const component = <CartProductList items={[]} />

    const wrapper = mount(
        wrapProviderIntlProvider(component, store)
    )

    expect(wrapper.length).toBe(1)
})

test('renders without errors with one item', () => {
    const component = (
        <CartProductList
            items={[{
                id: '1',
                productId: 'Product1',
                product: {id: 'Product1', title: 'Eye of Newt', price: '14.99'},
                quantity: 2,
                itemPrice: '14.99',
                linePrice: '29.98'
            }]}
            summary_count={2}
        />
    )

    const wrapper = mount(
        wrapProviderIntlProvider(component, store)
    )

    expect(wrapper.find(CartProductList).length).toBe(1)
})

test('renders the component class correctly', () => {
    const wrapper = shallow(<CartProductList items={[]} />, intlContext)

    expect(wrapper.hasClass('t-cart__product-list')).toBe(true)
})
