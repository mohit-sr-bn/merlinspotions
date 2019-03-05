/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {MORE_MENU} from '../constants'
import {closeModal, openModal} from '../actions'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {browserHistory} from 'progressive-web-sdk/dist/routing'

import Button from 'progressive-web-sdk/dist/components/button'
import Divider from 'progressive-web-sdk/dist/components/divider'
import Share from 'progressive-web-sdk/dist/components/share'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import ShareHeader from '../../components/share-header'

import {getAccountURL, getSignInURL} from '../../containers/app/selectors'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'

import {LOCATION_URL} from '../../containers/app/constants'

const SHARE_MODAL = 'share'

class MoreMenuModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {active: false}
    }

    componentWillMount() {
        setTimeout(() => {
            requestAnimationFrame(() => this.setState({active: true}))
        }, 100)
    }

    render() {
        const {closeModal, accountURL, isOpen, closeShare, openShare, isShareOpen, signInURL, isLoggedIn} = this.props
        const modalClasses = classNames('m-more-menu', {
            'm--active': isOpen && this.state.active
        })
        const linkClasses = 'u-justify-start u-padding-start-lg u-padding-end-lg'
        const shareButton = (<Button
            className="u-width-block-full"
            innerClassName="u-text-size-medium u-justify-start u-padding-start-lg u-padding-end-lg"
            text="Share..."
            data-analytics-name={UI_NAME.shareMenu}
        />)

        return (
            <div>
                <div className={modalClasses}>
                    <div className="m-more-menu__content u-align-center u-padding-bottom u-padding-top">
                        <div>
                            <Button
                                className="u-width-block-full"
                                innerClassName={`${linkClasses} u-color-neutral-60`}
                                iconClassName="u-color-brand u-margin-end"
                                href={LOCATION_URL}
                                icon="map"
                                data-analytics-name={UI_NAME.showStoreLocator}
                                title="Store Locations"
                                showIconText
                            />
                            <Button
                                innerClassName={`${linkClasses} u-color-neutral-60`}
                                iconClassName="u-color-brand u-margin-end"
                                href={isLoggedIn ? accountURL : signInURL}
                                icon="user"
                                data-analytics-name={UI_NAME.showStoreLocator}
                                title={isLoggedIn ? 'My Account' : 'Sign In'}
                                showIconText
                            />
                        </div>
                        <Divider />
                        <div>
                            <Button
                                className="u-width-block-full"
                                innerClassName={linkClasses}
                                text="Forward"
                                onClick={() => { browserHistory.goForward() }}
                                data-analytics-name={UI_NAME.browserForward}
                            />

                            <Button
                                className="u-width-block-full"
                                innerClassName={linkClasses}
                                text="Refresh"
                                onClick={() => { window.location.reload() }}
                            />
                            <Share
                                triggerElement={shareButton}
                                open={isShareOpen}
                                onShow={openShare}
                                onDismiss={closeShare}
                                headerContent={ShareHeader(closeShare)}
                                coverage="40%"
                            />
                        </div>
                    </div>
                </div>

                <div
                    tabIndex="-1"
                    role="presentation"
                    className="m-more-menu__shade"
                    onTouchStart={closeModal}
                />
            </div>
        )
    }
}

MoreMenuModal.propTypes = {
    /**
     * The URL for the My account page
     */
    accountURL: PropTypes.string,
    /**
     * A function used to set the navigation-sheet's state to closed
     */
    closeModal: PropTypes.func,
    /**
     * A function to close the share modal
     */
    closeShare: PropTypes.func,
    /**
     * Indicates if the user is logged in
    */
    isLoggedIn: PropTypes.bool,
    /**
     * Whether the modal is open or not
     */
    isOpen: PropTypes.bool,
    /**
     * Whether the share modal is open or not
     */
    isShareOpen: PropTypes.bool,
    /**
     * A function to open the share modal
     */
    openShare: PropTypes.func,
    /**
     * The URL for the sign in page
     */
    signInURL: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    accountURL: getAccountURL,
    isLoggedIn: getIsLoggedIn,
    isOpen: isModalOpen(MORE_MENU),
    isShareOpen: isModalOpen(SHARE_MODAL),
    signInURL: getSignInURL
})

const mapDispatchToProps = {
    closeModal: () => closeModal(MORE_MENU, UI_NAME.removeItem),
    closeShare: () => closeModal(SHARE_MODAL, UI_NAME.shareMenu),
    openShare: () => openModal(SHARE_MODAL, UI_NAME.shareMenu)
}
export default connect(mapStateToProps, mapDispatchToProps)(MoreMenuModal)
