/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import classNames from 'classnames'

import Button from 'progressive-web-sdk/dist/components/button'
import {Grid, GridSpan} from 'progressive-web-sdk/dist/components/grid'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Image from 'progressive-web-sdk/dist/components/image'

import template from '../../template'
import PageMeta from '../../components/page-meta'

import {
    getCartHasItems,
    getCartLoaded,
    getCartPageMeta
} from 'progressive-web-sdk/dist/store/cart/selectors'
import {getAutoAddToCartInProgress} from './selectors'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'
import {isRunningInAstro} from '../app/selectors'

import {
    initialize,
    requestCartContent,
    openSignIn,
    continueShopping,
    disableNativeAlert
} from './actions'
import CartItems from './partials/cart-items'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const EmptyCartContents = ({
    hide,
    isLoggedIn,
    isRunningInAstro,
    openSignIn,
    continueShopping
}) => {
    const emptyCartClassnames = classNames('t-cart__empty u-flexbox u-flex u-direction-column u-align-center u-justify-center u-padding-top-lg u-margin-top', {
        'u-display-none': hide,
        't--hide': hide,
        't--viewport-height': isRunningInAstro
    })

    return (
        <GridSpan className={emptyCartClassnames}>
            <Image
                className="u-margin-bottom-md"
                height="140px"
                width="140px"
                alt="Illustrated upside-down top hat with a bug flying out"
                src={getAssetUrl(`static/img/cart/empty-cart@2x.png`)}
            />

            <div className="u-padding-md">
                <p className="u-padding-top u-padding-start-lg u-padding-end-lg u-text-align-center u-margin-bottom-lg">
                    Your shopping cart is empty. Sign in to retrieve saved items or continue shopping.
                </p>

                {!isLoggedIn &&
                    <Button
                        className="pw--primary u-text-uppercase u-h5 u-width-full u-margin-bottom-lg"
                        onClick={openSignIn}
                        data-analytics-name={UI_NAME.goToSignIn}
                    >
                        <Icon name="User" />
                        Sign In
                    </Button>
                }

                <Button
                    className="pw--tertiary u-text-uppercase u-h5 u-width-full"
                    onClick={continueShopping}
                    data-analytics-name={UI_NAME.continueShopping}
                >
                    Continue Shopping
                </Button>
            </div>
        </GridSpan>
    )
}

EmptyCartContents.propTypes = {
    continueShopping: PropTypes.func,
    hide: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isRunningInAstro: PropTypes.bool,
    openSignIn: PropTypes.func,
}

class Cart extends React.Component {
    componentDidMount() {
        const {
            disableNativeAlert,
            requestCartContent
        } = this.props

        disableNativeAlert()
        requestCartContent()
    }

    render() {
        const {
            autoAddToCartInProgress,
            cartLoaded,
            hasItems,
            isLoggedIn,
            isRunningInAstro,
            pageMeta,
            openSignIn,
            continueShopping
        } = this.props

        const isCartEmptyAndLoaded = !hasItems && cartLoaded
        const hideEmptyCart = !isCartEmptyAndLoaded || autoAddToCartInProgress
        const templateClassnames = classNames('t-cart u-bg-color-neutral-10', {
            't--loaded': cartLoaded
        })

        return (
            <div className={templateClassnames}>
                <PageMeta {...pageMeta} />

                <Grid className="u-center-piece">
                    {!isCartEmptyAndLoaded &&
                        <CartItems
                            onContinueShopping={continueShopping}
                            onOpenSignIn={openSignIn}
                        />
                    }

                    <EmptyCartContents
                        hide={hideEmptyCart}
                        isLoggedIn={isLoggedIn}
                        isRunningInAstro={isRunningInAstro}
                        openSignIn={openSignIn}
                        continueShopping={continueShopping}
                    />
                </Grid>
            </div>
        )
    }
}

Cart.propTypes = {
    autoAddToCartInProgress: PropTypes.bool,
    cartLoaded: PropTypes.bool,
    continueShopping: PropTypes.func,
    disableNativeAlert: PropTypes.func,
    hasItems: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isRunningInAstro: PropTypes.bool,
    openSignIn: PropTypes.func,
    pageMeta: PropTypes.object,
    removeItemID: PropTypes.string,
    requestCartContent: PropTypes.func,
}

Cart.initAction = initialize

const mapStateToProps = createPropsSelector({
    autoAddToCartInProgress: getAutoAddToCartInProgress,
    cartLoaded: getCartLoaded,
    hasItems: getCartHasItems,
    isLoggedIn: getIsLoggedIn,
    pageMeta: getCartPageMeta,
    isRunningInAstro
})

const mapDispatchToProps = {
    requestCartContent,
    openSignIn,
    continueShopping,
    disableNativeAlert
}

export default template(connect(mapStateToProps, mapDispatchToProps)(Cart))
