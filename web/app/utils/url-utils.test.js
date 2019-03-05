/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {getRequestPath} from './url-utils'
import {PROXY_PATH_PREFIX} from 'progressive-web-sdk/dist/ssr/constants'


test('getRequestPath returns proxied base path', () => {
    window.Progressive = {
        isServerSide: false
    }
    const requestPath = '/test/url'

    expect(getRequestPath('base/path', requestPath)).toBe(`${PROXY_PATH_PREFIX}/base/path${requestPath}`)
})

test('getRequestPath returns proxied base path when request path has no leading /', () => {
    window.Progressive = {
        isServerSide: false
    }
    const requestPath = 'test/url'

    expect(getRequestPath('base/path', requestPath))
        .toBe(`${PROXY_PATH_PREFIX}/base/path/${requestPath}`)
})
