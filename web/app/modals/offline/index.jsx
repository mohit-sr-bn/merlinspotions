/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import Button from 'progressive-web-sdk/dist/components/button'
import InlineLoader from 'progressive-web-sdk/dist/components/inline-loader'
import Sheet from 'progressive-web-sdk/dist/components/sheet'

import {OFFLINE_MODAL} from '../constants'
import {closeModal} from '../actions'
import {retryConnection} from '../../containers/app/actions'
import {isRetryingConnection} from '../../containers/app/selectors'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const OfflineModal = (props) => {
    const {closeModal, isOpen, duration, reload, retryingConnection} = props

    return (
        <Sheet
            open={isOpen}
            onDismiss={closeModal}
            duration={duration}
            maskOpacity={0.7}
            effect="modal-center"
            shrinkToContent
        >
            <div className="u-padding-md u-text-align-center">
                <div className="u-margin-top u-text-weight-bold">Offline mode</div>
                <p className="u-margin-top-md u-margin-bottom-lg">
                    Some content may not appear as expected. You can continue to navigate to pages
                    you have already visited, but in in order to load new content you must re-establish
                    your internet connection.
                </p>
                <Button
                    className="pw--secondary u-width-full u-text-uppercase u-margin-bottom"
                    onClick={reload}
                    data-analytics-name={UI_NAME.retryConnection}
                >
                    {retryingConnection ?
                        <InlineLoader className="pw--medium pw--white" dotCount={3} title="Retrying..." />
                    :
                        <span>Retry connection</span>
                    }
                </Button>
                <Button
                    className="pw--tertiary u-width-full u-text-uppercase"
                    onClick={closeModal}
                    data-analytics-name={UI_NAME.continueOffline}
                >
                    Continue offline
                </Button>
            </div>
        </Sheet>
    )
}

OfflineModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    /**
     * Duration will define the time the animation takes to complete.
     */
    duration: PropTypes.number,
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
    isOpen: isModalOpen(OFFLINE_MODAL),
    retryingConnection: isRetryingConnection
})

const mapDispatchToProps = {
    closeModal: () => closeModal(OFFLINE_MODAL, UI_NAME.offline),
    reload: retryConnection
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflineModal)
