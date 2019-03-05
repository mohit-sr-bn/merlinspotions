/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
/* eslint-disable import/namespace */

import {shallow} from 'enzyme'
import React from 'react'

import ConnectedFooter from './container'
const Footer = ConnectedFooter.WrappedComponent

describe('The footer', () => {
    test('Should not render footer at all if running in an Astro app', () => {
        const footer = shallow(<Footer isRunningInAstro={true} />)
        expect(footer.children().length).toBe(0)
    })

    test('Should render footer if not running in an Astro app', () => {
        const footerData = {
            get: (key) => {
                return {key}
            }
        }

        const footer = shallow(<Footer footer={footerData} isRunningInAstro={false} />)
        expect(footer.children().length).not.toBe(0)
    })
})
