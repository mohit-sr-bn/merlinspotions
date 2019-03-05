/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import template from '../../template'
import {initialize} from './actions'
import offlineCloud from '../../static/svg/offline-cloud.svg'
import PageMeta from '../../components/page-meta'
import DangerousHTML from 'progressive-web-sdk/dist/components/dangerous-html'
import Button from 'progressive-web-sdk/dist/components/button'


const PageNotFound = () => (
    <div className="t-page-not-found">
        <PageMeta title="Page Not Found" />
        <DangerousHTML html={offlineCloud}>
            {(htmlObj) => <div className="u-margin-bottom-md" dangerouslySetInnerHTML={htmlObj} />}
        </DangerousHTML>
        <h1>Page not found</h1>
        <div className="u-margin-top-lg u-margin-bottom-lg">
            <p>Fiddlesticks! We couldn't find that page.</p>
            <p>Please try another page.</p>
        </div>

        <Button
            text="Return Home"
            href="/"
            className="u-width-full pw--primary"
        />
    </div>
)

PageNotFound.propTypes = {
    title: PropTypes.string
}

PageNotFound.initAction = initialize



export default template(PageNotFound)

