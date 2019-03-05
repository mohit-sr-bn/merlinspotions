/* eslint-disable import/namespace */
/* eslint-disable import/named */
import React from 'react'
import PropTypes from 'prop-types'
import {Router as SDKRouter, Route, IndexRoute} from 'progressive-web-sdk/dist/routing'
import {Provider} from 'react-redux'

// Containers
import App from './containers/app/container'
// These templates are code-split out of the main bundle.
import {
    AccountDashboard,
    AccountAddress,
    AccountInfo,
    AccountOrderList,
    Cart,
    CheckoutConfirmation,
    CheckoutPayment,
    CheckoutShipping,
    Login,
    ProductList,
    ProductDetails,
    Wishlist,
    AccountViewOrder
} from './containers/templates'

// We build this into the app so we can load the home page right away
import Home from './containers/home/container'
import PageNotFound from './containers/page-not-found/container'
import CheckoutHeader from './containers/checkout-header/container'
import CheckoutFooter from './containers/checkout-footer/container'

import {isRunningInAstro, pwaNavigate} from './utils/astro-integration'
import {ssrRenderingCompleted} from 'progressive-web-sdk/dist/utils/universal-utils'

import {PERFORMANCE_METRICS} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {trackPerformance} from 'progressive-web-sdk/dist/analytics/actions'

let OnChange = () => {
    trackPerformance(PERFORMANCE_METRICS.templateWillMount)
}

if (isRunningInAstro) {
    // Redefine OnChange to enable Astro integration
    OnChange = (prevState, nextState, replace, callback) => {
        if (nextState.location.action === 'POP') {
            callback()
            return
        } else if (nextState.location.action === 'REPLACE') {
            callback()
            return
        }

        pwaNavigate().then(() => {
            trackPerformance(PERFORMANCE_METRICS.templateWillMount)
            callback()
        })
    }
}

class Router extends React.Component {
    componentWillMount() {
        trackPerformance(PERFORMANCE_METRICS.templateWillMount)
    }

    render() {
        const {
            store,
            history
        } = this.props

        // Once server-side rendering is complete, any props changes
        // or re-renders should be ignored. This is only relevant for
        // server-side rendering.
        if (ssrRenderingCompleted()) {
            return null
        }

        return (
            <Provider store={store}>
                <SDKRouter history={history || SDKRouter.defaultProps.history}>
                    <Route path="/" component={App} onChange={OnChange} >
                        <IndexRoute component={Home} routeName="home" />
                        <Route component={PageNotFound} path="page-not-found" routeName="pageNotFound" />
                        <Route component={Cart} path="checkout/cart/" routeName="cart" />
                        <Route component={Login} path="customer/account/login/" routeName="signin" />
                        <Route component={Login} path="customer/account/create/" routeName="register" />
                        <Route component={AccountInfo} path="customer/account/edit/" routeName="accountInfo" />
                        <Route component={AccountDashboard} path="customer/account" routeName="account" />
                        <Route component={AccountAddress} path="customer/address/*" routeName="accountAddress" />
                        <Route component={AccountOrderList} path="sales/order/history/" routeName="accountOrderList" />
                        <Route component={ProductList} path="potions.html" routeName="productListPage" />
                        <Route component={ProductList} path="books.html" routeName="productListPage" />
                        <Route component={ProductList} path="ingredients.html" routeName="productListPage" />
                        <Route component={ProductList} path="supplies.html" routeName="productListPage" />
                        <Route component={ProductList} path="new-arrivals.html" routeName="productListPage" />
                        <Route component={ProductList} path="charms.html" routeName="productListPage" />
                        <Route component={ProductList} path="catalogsearch/result/" routeName="searchResultPage" />
                        <Route component={ProductList} path="Search-Show" routeName="searchResultPage" />
                        {/* Careful. The routeName on this 'configure' route is used to change how the ProductDetails component renders */}
                        <Route component={ProductDetails} path="checkout/cart/configure/id/*/product_id/*/" routeName="cartEditPage" />
                        <Route component={ProductDetails} path="wishlist/index/configure/id/*/product_id/*/" routeName="wishlistEditPage" />
                        <Route component={ProductDetails} path="*.html" routeName="productDetailsPage" />
                        <Route component={Wishlist} path="wishlist/" routeName="wishlist" />
                        <Route component={AccountViewOrder} path="*/order/view/order_id/*/" routeName="accountViewOrder" />
                        <Route
                            component={CheckoutShipping}
                            path="checkout/"
                            routeName="checkout-shipping"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                            headerHasSignIn
                        />
                        {/*
                            The URL for the payment page on desktop is /checkout/#payment,
                            but routing wasn't working properly when using this as the
                            route path so we specify a fetchUrl to make sure when we
                            fetch it's using the URL for the desktop page
                        */}
                        <Route
                            component={CheckoutPayment}
                            path="checkout/payment/"
                            fetchUrl="/checkout/#payment"
                            routeName="checkout-payment"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                        />
                        <Route
                            component={CheckoutConfirmation}
                            path="checkout/onepage/success/"
                            routeName="checkout-confirmation"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                        />

                        {/* SFCC Connector routes */}
                        <Route component={Home} path="*/Home-Show*" routeName="home" />
                        <Route component={ProductList} path="*/womens*" routeName="productListPage" />
                        <Route component={ProductList} path="*/mens*" routeName="productListPage" />
                        <Route component={ProductList} path="*/newarrivals*" routeName="productListPage" />
                        <Route component={ProductList} path="*/electronics*" routeName="productListPage" />
                        <Route component={ProductList} path="*/gift-certificates*" routeName="productListPage" />
                        <Route component={ProductList} path="*/top-seller*" routeName="productListPage" />
                        <Route component={ProductList} path="*/Search-Show?*" routeName="productListPage" />
                        <Route component={Wishlist} path="*/Wishlist-Show" routeName="wishlist" />
                        <Route
                            component={CheckoutShipping}
                            path="*/COShipping-Start*"
                            routeName="checkout-shipping"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                            headerHasSignIn
                        />
                        <Route
                            component={CheckoutPayment}
                            path="*/COBilling-Start*"
                            routeName="checkout-payment"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                        />

                        <Route component={Login} path="*/Account-Show" routeName="signin" />
                        <Route component={AccountInfo} path="*/Account-EditProfile" routeName="accountInfo" />
                        <Route component={AccountDashboard} path="*/Account-Show/dashboard" routeName="account" />
                        <Route component={AccountAddress} path="*/Address-List" routeName="accountAddress" />
                        <Route component={AccountOrderList} path="*/Order-History" routeName="accountOrderList" />
                        <Route component={AccountViewOrder} path="*/Order-History*?showOrder*" routeName="accountViewOrder" />

                        <Route component={Cart} path="*/Cart-Show*" routeName="cart" />

                        <Route
                            component={CheckoutConfirmation}
                            path="*/COSummary-Submit*"
                            routeName="checkout-confirmation"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                        />

                        {/* Hybris Connector routes */}
                        <Route component={ProductDetails} path="p/*" routeName="productDetailsPage" />
                        <Route component={ProductDetails} path="*/p/*" routeName="productDetailsPage" />
                        <Route component={ProductList} path="c/*" routeName="productListPage" />
                        <Route component={ProductList} path="*/c/*" routeName="productListPage" />
                        <Route component={ProductList} path="search/*" routeName="productListPage" />
                        <Route
                            component={CheckoutShipping}
                            path="checkout/shipping"
                            routeName="checkout-shipping"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                            headerHasSignIn
                        />
                        <Route
                            component={CheckoutPayment}
                            path="checkout/payment"
                            routeName="checkout-payment"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                        />
                        <Route
                            component={CheckoutConfirmation}
                            path="checkout/confirmation"
                            routeName="checkout-confirmation"
                            Header={CheckoutHeader}
                            Footer={CheckoutFooter}
                        />
                    </Route>
                </SDKRouter>
            </Provider>
        )
    }
}

Router.propTypes = {
    history: PropTypes.object,
    store: PropTypes.object
}

export default Router
