/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import throttle from 'lodash.throttle'
import classnames from 'classnames'

import * as headerActions from './actions'
import * as appActions from '../app/actions'
import * as miniCartActions from '../../modals/mini-cart/actions'
import {openModal} from '../../modals/actions'
import {NAVIGATION_MODAL, MORE_MENU} from '../../modals/constants'
import * as selectors from './selectors'
import MegaNavigation from '../../components/mega-navigation'

import {isStandaloneApp, getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'
import {HeaderBar} from 'progressive-web-sdk/dist/components/header-bar'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Link from 'progressive-web-sdk/dist/components/link'
import Search from 'progressive-web-sdk/dist/components/search'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import NavigationAction from './partials/navigation-action'
import HeaderTitle from './partials/header-title'
import StoresAction from './partials/stores-action'
import CartAction from './partials/cart-action'
import SearchAction from './partials/search-action'
import BackAction from './partials/back-action'
import MoreMenuAction from './partials/more-action'

import {isRunningInAstro} from '../app/selectors'

import {VIEWPORT_SIZE_NAMES} from 'progressive-web-sdk/dist/ssr/constants'

const SCROLL_CHECK_INTERVAL = 200

const HeaderSearch = (p) =>
    <Search
        className="t-header__search"
        isOverlay={p.isOverlay}
        onClickSuggestion={p.onSearchCloseClick}
        isOpen={p.searchIsOpen}
        onChange={p.onChangeSearchQuery}
        onClose={p.onSearchCloseClick}
        onSubmit={p.onSearchSubmit}
        onClear={p.clearSuggestions}
        termSuggestions={p.searchSuggestions}
        submitButtonProps={{
            className: 'pw--secondary t-header__search-submit-button',
            children: <Icon name="search" title="Submit search" />
        }}
        inputProps={{
            placeholder: 'Search the entire store',
            name: 'query'
        }}
        closeButtonProps={{
            className: 'u-visually-hidden',
            children: 'Dismiss search'
        }}
        clearButtonProps={{
            className: 'u-color-brand',
            children: <Icon name="close" title="Clear search field" />
        }}
    />


class Header extends React.Component {
    constructor(props) {
        super(props)

        this.handleScroll = throttle(this.handleScroll.bind(this), SCROLL_CHECK_INTERVAL)
        // Start off uncollapsed
        this.headerHeight = Number.MAX_VALUE

        this.onChangeSearchQuery = this.onChangeSearchQuery.bind(this)
        this.onSearchSubmit = this.onSearchSubmit.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    onChangeSearchQuery(e) {
        const {value} = e.target
        this.props.searchQueryChanged(value)
    }

    onSearchSubmit(e) {
        e.preventDefault()

        const value = e.target.query.value
        this.props.searchSubmit(value)
    }

    handleScroll() {
        const {isCollapsed} = this.props
        const newIsCollapsed = window.pageYOffset > this.headerHeight

        // Don't trigger the action unless things have changed
        // Don't trigger on A2HS / Standalone mode
        if (newIsCollapsed !== isCollapsed && !this.props.isStandaloneApp) {
            this.props.toggleHeader(newIsCollapsed)
        }
    }

    render() {
        const {
            onMenuClick,
            onMiniCartClick,
            onMoreMenuClick,
            onSearchOpenClick,
            goBack,
            isCollapsed,
            isStandaloneApp,
            showBackButton,
            viewportSize,
            isRunningInAstro,
            isLoggedIn,
            logoutAction
        } = this.props

        if (isRunningInAstro) {
            return null
        }

        const mediumOrSmaller = viewportSize === VIEWPORT_SIZE_NAMES.SMALL || viewportSize === VIEWPORT_SIZE_NAMES.MEDIUM
        const largeOrXlarge = viewportSize === VIEWPORT_SIZE_NAMES.LARGE || viewportSize === VIEWPORT_SIZE_NAMES.XLARGE

        const innerButtonClassName = classnames('t-header__inner-button', 'u-padding-0', {
            't--hide-label': isCollapsed
        })

        const headerBarClassNames = classnames('t-header__bar', {
            't--standalone': isStandaloneApp
        })

        return (
            <header className="t-header" ref={(el) => { this.headerHeight = el ? el.scrollHeight : Number.MAX_VALUE }}>
                <div className={headerBarClassNames}>
                    {!mediumOrSmaller &&
                        <div className="t-header__attic">
                            <div className="t-header__max-width">
                                {isLoggedIn ?
                                    <Link
                                        onClick={logoutAction}
                                        className="t-header__attic-link"
                                    >
                                        Logout
                                    </Link>
                                :
                                    <Link
                                        href="/customer/account/login/"
                                        className="t-header__attic-link"
                                    >
                                        Login
                                    </Link>
                                }

                                {isLoggedIn &&
                                    <Link
                                        href="/customer/account"
                                        className="t-header__attic-link"
                                    >
                                        My Account
                                    </Link>
                                }

                                {isLoggedIn &&
                                    <Link
                                        href="/wishlist"
                                        className="t-header__attic-link"
                                    >
                                        Wishlist
                                    </Link>
                                }

                                <Link href="/sales/guest/form/" className="t-header__attic-link">Orders & Returns</Link>
                                <Link href="/contact/" className="t-header__attic-link">Help</Link>
                            </div>
                        </div>
                    }

                    <div className="t-header__bar-wrapper">
                        <div className="t-header__max-width">
                            <HeaderBar>
                                {showBackButton &&
                                    <BackAction
                                        innerButtonClassName={innerButtonClassName}
                                        onClick={goBack}
                                    />
                                }

                                {(!showBackButton && mediumOrSmaller) &&
                                    <NavigationAction
                                        innerButtonClassName={innerButtonClassName}
                                        onClick={onMenuClick}
                                    />
                                }

                                <HeaderTitle isCollapsed={isCollapsed} />

                                <div className="t-header__grouped-actions">
                                    {viewportSize === VIEWPORT_SIZE_NAMES.SMALL ?
                                        <SearchAction
                                            innerButtonClassName={innerButtonClassName}
                                            onClick={onSearchOpenClick}
                                        />
                                    :
                                        <HeaderSearch
                                            onChangeSearchQuery={this.onChangeSearchQuery}
                                            onSearchSubmit={this.onSearchSubmit}
                                            isOverlay={false}
                                            {...this.props}
                                        />
                                    }

                                    {!isStandaloneApp &&
                                        <StoresAction
                                            innerButtonClassName={innerButtonClassName}
                                        />
                                    }

                                    <CartAction
                                        innerButtonClassName={innerButtonClassName}
                                        onClick={onMiniCartClick}
                                    />

                                    {isStandaloneApp &&
                                        <MoreMenuAction
                                            innerButtonClassName={innerButtonClassName}
                                            onClick={onMoreMenuClick}
                                        />
                                    }
                                </div>
                            </HeaderBar>
                        </div>
                    </div>

                    {largeOrXlarge &&
                        <div className="t-header__mega-nav">
                            <div className="t-header__max-width">
                                <MegaNavigation />
                            </div>
                        </div>
                    }
                </div>

                {viewportSize === VIEWPORT_SIZE_NAMES.SMALL &&
                    <HeaderSearch
                        onChangeSearchQuery={this.onChangeSearchQuery}
                        onSearchSubmit={this.onSearchSubmit}
                        isOverlay={true}
                        {...this.props}
                    />
                }
            </header>
        )
    }
}

Header.propTypes = {
    clearSuggestions: PropTypes.func,
    goBack: PropTypes.func,
    isCollapsed: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isRunningInAstro: PropTypes.bool,
    isStandaloneApp: PropTypes.bool,
    logoutAction: PropTypes.func,
    searchIsOpen: PropTypes.bool,
    searchQueryChanged: PropTypes.func,
    searchSubmit: PropTypes.func,
    searchSuggestions: PropTypes.array,
    showBackButton: PropTypes.bool,
    toggleHeader: PropTypes.func,
    viewportSize: PropTypes.string,
    onMenuClick: PropTypes.func,
    onMiniCartClick: PropTypes.func,
    onMoreMenuClick: PropTypes.func,
    onSearchCloseClick: PropTypes.func,
    onSearchOpenClick: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    isCollapsed: selectors.getIsCollapsed,
    isStandaloneApp,
    searchIsOpen: selectors.getSearchIsOpen,
    searchSuggestions: selectors.getSearchSuggestions,
    showBackButton: selectors.showBackButton,
    viewportSize: getviewportSize,
    isRunningInAstro,
    isLoggedIn: getIsLoggedIn
})

const mapDispatchToProps = {
    onMenuClick: () => openModal(NAVIGATION_MODAL, UI_NAME.menu),
    onMiniCartClick: miniCartActions.requestOpenMiniCart,
    goBack: headerActions.goBack,
    onSearchOpenClick: headerActions.openSearchModal,
    onSearchCloseClick: headerActions.closeSearchModal,
    onMoreMenuClick: () => openModal(MORE_MENU, 'more_menu'),
    searchSubmit: headerActions.searchSubmit,
    toggleHeader: headerActions.toggleHeader,
    searchQueryChanged: headerActions.searchQueryChanged,
    clearSuggestions: headerActions.clearSuggestions,
    logoutAction: appActions.signOut
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)
