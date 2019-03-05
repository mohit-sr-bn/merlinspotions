/**
 * @jest-environment node
 */

/* eslint-env jest */
import AmpHtmlValidator from 'amphtml-validator'
import httpMocks from 'node-mocks-http'
import events from 'events'
import fetch from 'node-fetch'
import {URL} from 'whatwg-url'
import {productListingTemplates, productDetailsTemplates} from './templates/templateUrls'

import app from './main'

describe('Renders valid AMP', () => {
    let validator

    beforeAll(() => {
        global.fetch = fetch
        global.URL = URL
        return AmpHtmlValidator.getInstance().then((v) => { validator = v })
    })

    const validateAmp = (html) => {
        expect(validator.validateString(html).errors).toEqual([])
    }

    const handle = (req) => {
        return new Promise((resolve) => {
            const res = httpMocks.createResponse({
                eventEmitter: events.EventEmitter
            })

            res.on('end', () => resolve(res))
            res.on('send', () => resolve(res))
            console.log(req)

            app.handle(req, res)
        })
    }

    productListingTemplates.forEach((route) => {
        test(`ProductList - ${route}`, () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: route
            })
            return handle(req).then((res) => {
                validateAmp(res._getData())
            })
        })
    })

    productDetailsTemplates.forEach((route) => {
        test(`ProductDetails - ${route}`, () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: route
            })
            return handle(req).then((res) => {
                validateAmp(res._getData())
            })
        })
    })
})
