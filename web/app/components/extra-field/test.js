/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* eslint-env jest */

import {shallow} from 'enzyme'
import React from 'react'

import ExtraField from './index.jsx'

const extraFields = [
    {
        name: 'select-field',
        analyticsName: 'select-field',
        label: 'Select',
        type: 'select',
        options: [
            {
                code: 'A',
                name: 'Aaa'
            },
            {
                code: 'B',
                name: 'Bbb'
            }
        ]
    },
    {
        name: 'input-field',
        analyticsName: 'input-field',
        label: 'Input Field',
        type: 'input'
    }
]

describe('<ExtraField>', () => {
    test('renders <input> field when type is \'input\'', () => {
        const wrapper = shallow(<ExtraField extraFields={extraFields} name="input-field" />)
        expect(wrapper.find('input')).toHaveLength(1)
    })

    test('renders <select> field when type is \'select\'', () => {
        const wrapper = shallow(<ExtraField extraFields={extraFields} name="select-field" />)
        expect(wrapper.find('select')).toHaveLength(1)
    })

    test('does not render anything if no name supplied', () => {
        const wrapper = shallow(<ExtraField extraFields={[]} name="" />)
        expect(wrapper.children().length).toBe(0)
    })

    /* eslint-disable newline-per-chained-call */
    test('includes the component class name when no className prop supplied', () => {
        const wrapper = shallow(<ExtraField extraFields={extraFields} name="input-field" />)
        expect(wrapper.find('Field').hasClass('c-extra-field')).toBe(true)
    })

    test('does not render an \'undefined\' class with no className', () => {
        const wrapper = shallow(<ExtraField extraFields={extraFields} name="input-field" />)
        expect(wrapper.find('Field').hasClass('undefined')).toBe(false)
    })

    test('renders the contents of the className prop if present', () => {
        [
            'test',
            'test another'
        ].forEach((name) => {
            const wrapper = shallow(<ExtraField className={name} extraFields={extraFields} name="input-field" />)
            expect(wrapper.find('Field').hasClass(name)).toBe(true)
        })
    })
})
