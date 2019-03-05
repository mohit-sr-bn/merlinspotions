/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {shallow} from 'enzyme'
/* eslint-env jest */
import React from 'react'
import Immutable from 'immutable'
import {wrapProviderIntlProvider} from '../../utils/test-utils'

import ItemAddedModalContents from './index.jsx'
const price = '100'

const appStore = {
    app: Immutable.fromJS({
        selectedCurrency: 'USD',
        symbol: '$'
    })
}

test('ItemAddedModalContents renders without errors', () => {
    const wrapper = shallow(
        wrapProviderIntlProvider(<ItemAddedModalContents price={price} />, appStore)
    )

    expect(wrapper.find(ItemAddedModalContents).length).toBe(1)
})

/* eslint-disable newline-per-chained-call */
test('includes the component class name with no className prop', () => {
    const wrapper = shallow(<ItemAddedModalContents price={price} />)

    expect(wrapper.hasClass('c-item-added-modal-contents')).toBe(true)
})

test('does not render an \'undefined\' class with no className', () => {
    const wrapper = shallow(<ItemAddedModalContents price={price} />)

    expect(wrapper.hasClass('undefined')).toBe(false)
})

test('renders the contents of the className prop if present', () => {
    [
        'test',
        'test another'
    ].forEach((name) => {
        const wrapper = shallow(<ItemAddedModalContents className={name} price={price} />)

        expect(wrapper.hasClass(name)).toBe(true)
    })
})
