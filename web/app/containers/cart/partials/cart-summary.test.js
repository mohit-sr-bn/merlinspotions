/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import React from 'react'
import ConnectedCartSummary from './cart-summary'
import Immutable from 'immutable'
import {shallow} from 'enzyme'
import {wrapProviderIntlProvider} from '../../../utils/test-utils'
const CartSummary = ConnectedCartSummary

const appStore = {
    app: Immutable.fromJS({
        selectedCurrency: 'USD',
        symbol: '$'
    })
}

test('renders without errors', () => {
    const wrapper = shallow(
        wrapProviderIntlProvider(<CartSummary currencyCode="USD" />, appStore)
    )

    expect(wrapper.find(CartSummary).length).toBe(1)
})
