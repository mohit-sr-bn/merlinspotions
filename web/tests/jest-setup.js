/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import 'raf/polyfill' // fix requestAnimationFrame issue with polyfill
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import $ from '../app/static/js/jquery.min.js'
import fs from 'fs'

Enzyme.configure({adapter: new Adapter()})

// Parser tests need to be supplied a selector library
global.$ = $

// Prevents a console.error when using asset-utils/getAssetUrl in tests
global.document.head.innerHTML = '<head><script src="https://localhost:8443/loader.js"></script></head>'

// Ensures that a manifest is present for code that imports it
const manifestFile = './tmp/cache-hash-manifest.json'
if (!fs.existsSync('tmp')) {
    fs.mkdirSync('tmp')
}
if (!fs.existsSync(manifestFile)) {
    fs.writeFileSync(
        fs.openSync(manifestFile, 'w'),
        '{"hashes":{}, "buildDate": 1535488927369}'
    )
}
