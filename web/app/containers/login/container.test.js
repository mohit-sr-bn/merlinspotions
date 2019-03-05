/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
/* eslint-disable import/namespace */

import {shallow} from 'enzyme'
import React from 'react'

import ConnectedLogin from './container'
const Login = ConnectedLogin.WrappedComponent.WrappedComponent

describe('The Login', () => {
    test('Should render tab if not running in Astro', () => {
        const route = {
            route: 'register'
        }
        const login = shallow(<Login route={route} isRunningInAstro={false} />)
        expect(login.find('TabsPanel')).toHaveLength(2)
    })

    test('Should not render tabs at all if running in an Astro app', () => {
        const route = {
            route: 'signin'
        }
        const login = shallow(<Login route={route} isRunningInAstro={true} />)
        expect(login.find('TabsPanel')).toHaveLength(0)
    })
})
