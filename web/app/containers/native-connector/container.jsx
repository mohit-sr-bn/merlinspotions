/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {isAppInitialized} from '../app/selectors'
import {getCartSummaryCount} from 'progressive-web-sdk/dist/store/cart/selectors'

import {connect} from 'react-redux'

import {onAstroEvent, disableAstroEvent} from '../../utils/astro-integration'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'

import * as actions from './actions'

const cartModalNeedsUpdate = 'cart:modal-needs-update'
const broadcastUserDidLogin = 'broadcast:user:did-login'
const broadcastUserDidLogout = 'broadcast:user:did-logout'

/**
 * Provides a relay with the Native (Astro) part of the app This class can
 * safely assume it's running within an Astro app and does not need to check
 * `isRunningInAstro` ever.
 */
class NativeConnector extends React.Component {
    updateAstroLoggedInStatus(isLoggedIn) {
        if (isLoggedIn) {
            this.props.rpcUserIsLoggedIn()
        } else if (isLoggedIn === false) {
            // When this component is initially rendered,
            // isLoggedIn will be null,
            // because we haven't gotten that info from the back end yet.
            // At that point, we don't know the user's actual state,
            // so we have to wait until its definitely false
            this.props.rpcUserIsGuest()
        }
    }

    updateAstroCartCount(cartItemCount) {
        // Distinguish between changes from fetching the cart when initializing the app
        // and when the user adds or removes items from the cart
        this.props.cartCountUpdated(cartItemCount, this.props.appInitialized)
    }

    componentDidMount() {
        const {
            isLoggedIn,
            refreshCart,
            syncLoggedIn,
            syncLoggedOut
        } = this.props

        onAstroEvent(cartModalNeedsUpdate, refreshCart)

        onAstroEvent(broadcastUserDidLogin, syncLoggedIn)
        onAstroEvent(broadcastUserDidLogout, syncLoggedOut)


        this.updateAstroLoggedInStatus(isLoggedIn)
    }

    componentWillUnmount() {
        disableAstroEvent(cartModalNeedsUpdate)
        disableAstroEvent(broadcastUserDidLogin)
        disableAstroEvent(broadcastUserDidLogout)
    }

    componentWillReceiveProps(nextProps) {
        const {
            isLoggedIn,
            itemCount
        } = this.props

        const nextItemCount = nextProps.itemCount
        if (nextItemCount !== itemCount) {
            this.updateAstroCartCount(nextItemCount)
        }

        const nextIsLoggedIn = nextProps.isLoggedIn
        if (nextIsLoggedIn !== isLoggedIn) {
            this.updateAstroLoggedInStatus(nextIsLoggedIn)
        }
    }

    render() {
        return <span className="nativeConnector" />
    }
}

NativeConnector.propTypes = {
    appInitialized: PropTypes.bool,
    cartCountUpdated: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    itemCount: PropTypes.number,
    refreshCart: PropTypes.func,
    rpcUserIsGuest: PropTypes.func,
    rpcUserIsLoggedIn: PropTypes.func,
    syncLoggedIn: PropTypes.func,
    syncLoggedOut: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    isLoggedIn: getIsLoggedIn,
    itemCount: getCartSummaryCount,
    appInitialized: isAppInitialized
})

const mapDispatchToProps = {
    refreshCart: actions.refreshCart,
    syncLoggedIn: actions.syncLoggedIn,
    syncLoggedOut: actions.syncLoggedOut,
    rpcUserIsLoggedIn: actions.rpcUserIsLoggedIn,
    rpcUserIsGuest: actions.rpcUserIsGuest,
    cartCountUpdated: actions.cartCountUpdated
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NativeConnector)
