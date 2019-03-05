/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Sheet from 'progressive-web-sdk/dist/components/sheet'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'

import {stripEvent} from 'progressive-web-sdk/dist/utils/utils'
import {closeModal} from '../actions'
import {PRIVACY_MODAL} from '../constants'
import {acceptPrivacyCookie} from './actions'


const PrivacyModal = ({
    acceptPrivacyCookie,
    isOpen,
    closeThisModal,
    duration,
}) => {
    return (
        <Sheet
            className="m-privacy"
            open={isOpen}
            onDismiss={closeThisModal}
            duration={duration}
            maskOpacity={0}
            effect="slide-bottom"
            coverage="40%"
            shrinkToContent={true}
        >
            <div className="u-flexbox u-align-center u-padding-end-0 u-padding-start-md u-padding-top u-padding-bottom-sm">
                <Icon name="lock" className="u-flex-none u-margin-end-md" />

                <h1 className="u-h5 u-text-family u-text-weight-bold u-flex">
                    We care about your privacy
                </h1>

                <Button
                    icon="close"
                    text="Close"
                    className="u-flex-none"
                    data-analytics-name="privacy_modal:dismiss"
                    onClick={closeThisModal}
                />
            </div>

            <p className="u-text-size-medium u-padding-start-md u-padding-end-md">
                Allow us to track details of your visit today to present great recommendations and keep your saved items for next time.
            </p>

            <div className="u-flexbox u-padding-md u-padding-end-0">
                <Button
                    className="pw--secondary u-margin-end u-flex"
                    text="Accept"
                    data-analytics-name="privacy_modal:accept"
                    onClick={() => {
                        acceptPrivacyCookie()
                        closeThisModal()
                    }}
                />

                <Button
                    className="pw--tertiary u-flex"
                    text="Decline"
                    data-analytics-name="privacy_modal:decline"
                    onClick={closeThisModal}
                />

                <Button
                    className="u-flex-none"
                    href="/privacy-policy-cookie-restriction-mode"
                    openInNewTab={true}
                    data-analytics-name="privacy_modal:tell_me_more"
                    text="Tell me more"
                />
            </div>

            <p className="u-padding-start-md u-padding-end-md u-padding-bottom-lg u-color-neutral-50">
                We don't share your data with anyone else.
            </p>
        </Sheet>
    )
}

PrivacyModal.propTypes = {
    acceptPrivacyCookie: PropTypes.func,
    closeThisModal: PropTypes.func,
    duration: PropTypes.number,
    isOpen: PropTypes.bool,
}

const mapStateToProps = createPropsSelector({
    isOpen: isModalOpen(PRIVACY_MODAL),
})

const mapDispatchToProps = {
    acceptPrivacyCookie: stripEvent(() => acceptPrivacyCookie()),
    closeThisModal: stripEvent(() => closeModal(PRIVACY_MODAL))
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrivacyModal)
