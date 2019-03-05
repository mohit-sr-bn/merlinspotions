/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
'use strict'
/* eslint-env node */

/*
 * A custom loader to fixup an issue in jsdom
 */

module.exports = function(source) { // eslint-disable-line import/no-commonjs
    return source.replace(
        // match require.resolve used in a query expression...
        /require\.resolve\s*\?/,
        // ...replace with a falsy constant so that the expression
        // always returns the false result.
        '0 ?'
    )
}
