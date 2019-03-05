/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {extractPathFromURL} from 'progressive-web-sdk/dist/utils/utils'
import {createPropsSelector} from 'reselect-immutable-helpers'
import Nav from 'progressive-web-sdk/dist/components/nav'
import NavMenu from 'progressive-web-sdk/dist/components/nav-menu'
import NavItem from 'progressive-web-sdk/dist/components/nav-item'
import Sheet from 'progressive-web-sdk/dist/components/sheet'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {HeaderBar, HeaderBarActions, HeaderBarTitle} from 'progressive-web-sdk/dist/components/header-bar'
import {withRouter} from 'progressive-web-sdk/dist/routing'
import {isReactRoute} from 'progressive-web-sdk/dist/routing/is-react-route'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'

import InstallAppButton from '../../components/install-app-button'
import IconLabelButton from '../../components/icon-label-button'
import {AccountNavItem, NavItemWithOnClick, NavItemIcon} from '../../components/nav-item'
import * as selectors from './selectors'
import {getLocale} from '../../containers/app/selectors'
import {supportedLanguages} from '../../config/translations-config'
import {
    ACCOUNT_NAV_ITEM,
    SIGN_OUT_NAV_ITEM,
    SIGNED_OUT_ACCOUNT_NAV_ITEM,
    LOCALE_NAV_ITEM,
    LOCALE_NAV_HEADER,
    INSTALL_APP_ITEM
} from './constants'
import {NAVIGATION_MODAL} from '../constants'
import {closeModal} from '../actions'
import * as appActions from '../../containers/app/actions'
import {setNavigationPath} from './actions'
import NavigationSocialIcons from './partials/navigation-social-icons'

const Header = ({closeNavigation}) => (
    <HeaderBar>
        <HeaderBarTitle className="u-flex u-padding-start u-text-align-start u-color-neutral-00" href="/">
            <h2 className="u-text-family-header u-text-uppercase">
                <span className="u-text-weight-extra-light">Menu</span>
            </h2>
        </HeaderBarTitle>

        <HeaderBarActions>
            <IconLabelButton iconName="close" label="close" onClick={closeNavigation} analyticsName={UI_NAME.dismissModal} />
        </HeaderBarActions>
    </HeaderBar>
)

Header.propTypes = {
    closeNavigation: PropTypes.func
}


const Navigation = (props) => {
    const {
        path,
        isOpen,
        root,
        closeNavigation,
        router,
        setNavigationPath,
        logoutAction,
        duration,
        prerender,
        changeLocale,
        locale
    } = props

    const onPathChange = (path, isLeaf) => {
        if (isLeaf) {
            const routerPath = extractPathFromURL(path, true)

            if (isReactRoute(path)) {
                router.push(routerPath)
            } else {
                window.location.href = path
            }

            setNavigationPath('/')
            closeNavigation()
        } else {
            setNavigationPath(path)
        }
    }

    /**
     * Factory function to create project-specific NavItems
     */
    const itemFactory = (type, props) => {
        const extendedProps = {
            ...props,
            href: props.path
        }

        switch (type) {
            case SIGNED_OUT_ACCOUNT_NAV_ITEM:
                return null
            case ACCOUNT_NAV_ITEM:
                return <AccountNavItem {...extendedProps} />
            case SIGN_OUT_NAV_ITEM:
                return (
                    <NavItemWithOnClick
                        {...extendedProps}
                        onClick={() => {
                            logoutAction()
                            closeNavigation()
                        }}
                    />
                )
            case INSTALL_APP_ITEM:
                // delete href to deactivate navigation
                delete extendedProps.href
                return <InstallAppButton {...extendedProps} />
            case LOCALE_NAV_HEADER:
                return (
                    <NavItemWithOnClick
                        {...extendedProps}
                        content={
                            <div className="u-text-align-center m-navigation__padding-end-tap-size u-text-weight-bold">
                                Language
                            </div>
                        }
                        onClick={() => setNavigationPath('/')}
                    />
                )
            case LOCALE_NAV_ITEM:
                return (
                    <NavItemWithOnClick
                        {...extendedProps}
                        selected={extendedProps.options.locale === locale}
                        onClick={() => {
                            closeNavigation()
                            setNavigationPath('/')
                            changeLocale(extendedProps.options.locale)
                        }}
                    />
                )
            default:
                return (
                    <NavItem
                        {...extendedProps}
                        beforeContent={extendedProps.options && extendedProps.options.hasLogo && <NavItemIcon name="edit" />}
                        childIcon={<NavItemIcon name="chevron-right" />}
                        title={extendedProps.title ? extendedProps.title : supportedLanguages[locale]}
                    />
                )
        }
    }

    const placeholders = !path ? new Array(6).fill({
        height: '44px',
        className: 'u-border-bottom'
    }) : []

    return (
        <Sheet className="m-navigation"
            open={isOpen}
            onDismiss={closeNavigation}
            duration={duration}
            maskOpacity={0.7}
            coverage="85%"
            prerender={prerender}
        >
            {path ?
                <Nav
                    className="m-navigation__wrapper"
                    root={root.title ? root : null}
                    path={path}
                    onPathChange={onPathChange}
                >
                    <Header closeNavigation={closeNavigation} />

                    <NavMenu itemFactory={itemFactory} />

                    <div>
                        <NavigationSocialIcons />
                        <div className="m-navigation__copyright u-padding-md">
                            <p>© 2017 Mobify Research & Development Inc. All rights reserved.</p>
                        </div>
                    </div>
                </Nav>
            :
                <div>
                    <Header closeNavigation={closeNavigation} />

                    {placeholders.map((props, index) =>
                        <SkeletonBlock key={index} {...props} />
                    )}
                </div>
            }
        </Sheet>
    )
}


Navigation.propTypes = {
    /**
    * Sets the current locale and updates translations for the site
    */
    changeLocale: PropTypes.func,

    /**
     * A function used to set the navigation-sheet's state to closed
     */
    closeNavigation: PropTypes.func,

    /**
     * Duration will define the time the animation takes to complete.
     */
    duration: PropTypes.number,

    isOpen: PropTypes.bool,
    locale: PropTypes.string,
    logoutAction: PropTypes.func,
    options: PropTypes.object,
    path: PropTypes.string,
    prerender: PropTypes.bool,

    /**
    * Represents the site's navigation tree
    */
    root: PropTypes.object,
    /**
     * The react-router router object.
     */
    router: PropTypes.object,
    /**
    * Sets the current path for the navigation menu
    */
    setNavigationPath: PropTypes.func,
    title: PropTypes.string
}


const mapStateToProps = createPropsSelector({
    path: selectors.getPath,
    isOpen: isModalOpen(NAVIGATION_MODAL),
    root: selectors.getNavigationRoot,
    locale: getLocale
})

const mapDispatchToProps = {
    closeNavigation: () => closeModal(NAVIGATION_MODAL, UI_NAME.menu),
    setNavigationPath,
    logoutAction: appActions.signOut,
    changeLocale: appActions.changeLocale
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navigation))
