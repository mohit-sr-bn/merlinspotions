/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import DangerousHTML from 'progressive-web-sdk/dist/components/dangerous-html'
import Button from 'progressive-web-sdk/dist/components/button'
import InlineLoader from 'progressive-web-sdk/dist/components/inline-loader'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {isRetryingConnection} from '../app/selectors'
import {retryConnection} from '../app/actions'

import PageMeta from '../../components/page-meta'
import offlineCloud from '../../static/svg/offline-cloud.svg'

/**
 * UI to be shown instead of the page contents while offline and no
 * contents are available.
 */
const Offline = (props) => {
    const {
        reload,
        retryingConnection
    } = props

    return (
        <div className="t-offline">
            <PageMeta title="Offline" />

            <DangerousHTML html={offlineCloud}>
                {(htmlObj) => <div className="u-margin-bottom-md" dangerouslySetInnerHTML={htmlObj} />}
            </DangerousHTML>

            <p>Fiddlesticks! We couldn't load the</p>
            <p>next page on this connection.</p>
            <p>Please try again.</p>

            <Button
                className="pw--tertiary u-width-full u-text-uppercase u-margin-top-lg"
                onClick={reload}
                data-analytics-name={UI_NAME.retryConnection}
            >
                {retryingConnection ?
                    <InlineLoader className="pw--medium" dotCount={3} title="Retrying..." />
                :
                    <span>Retry</span>
                }
            </Button>
        </div>
    )
}

Offline.propTypes = {
    /**
     * Method that attempts to fetch the page again
     */
    reload: PropTypes.func,

    /**
     * Indicates if we are currently retrying the connection
     */
    retryingConnection: PropTypes.bool
}

const mapStateToProps = createPropsSelector({
    retryingConnection: isRetryingConnection
})

const mapDispatchToProps = {
    reload: retryConnection
}

export default connect(mapStateToProps, mapDispatchToProps)(Offline)
