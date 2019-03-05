/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
/* eslint-disable import/namespace */

import {shallow} from 'enzyme'
import React from 'react'

import ConnectedHeader from './container'
const Header = ConnectedHeader.WrappedComponent

describe('The header', () => {
    test('Should not render header at all if running in an Astro app', () => {
        const header = shallow(<Header isRunningInAstro={true} />)
        expect(header.children().length).toBe(0)
    })

    test('Should render header if not running in an Astro app', () => {
        const header = shallow(<Header isRunningInAstro={false} />)
        expect(header.children().length).not.toBe(0)
    })
})
