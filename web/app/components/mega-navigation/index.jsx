/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {withRouter} from 'progressive-web-sdk/dist/routing'
import {isReactRoute} from 'progressive-web-sdk/dist/routing/is-react-route'
import {extractPathFromURL} from 'progressive-web-sdk/dist/utils/utils'

import * as selectors from '../../modals/navigation/selectors'
import {setNavigationPath} from '../../modals/navigation/actions'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'

import MegaMenu from 'progressive-web-sdk/dist/components/mega-menu'
import MegaMenuItem from 'progressive-web-sdk/dist/components/mega-menu-item'
import Nav from 'progressive-web-sdk/dist/components/nav'
import InstallAppButton from '../../components/install-app-button'

import {
    ACCOUNT_NAV_ITEM,
    SIGN_OUT_NAV_ITEM,
    SIGNED_OUT_ACCOUNT_NAV_ITEM,
    LOCALE_NAV_ITEM,
    LOCALE_NAV_HEADER,
    INSTALL_APP_ITEM
} from '../../modals/navigation/constants'


const itemFactory = (type, itemProps) => { // eslint-disable-line react/display-name
    const extendedProps = {
        ...itemProps,
        href: itemProps.path
    }

    switch (type) {
        case SIGNED_OUT_ACCOUNT_NAV_ITEM:
        case LOCALE_NAV_ITEM:
        case LOCALE_NAV_HEADER:
        case SIGN_OUT_NAV_ITEM:
        case ACCOUNT_NAV_ITEM:
            return null // prevent these nav items from rendering!
        case INSTALL_APP_ITEM:
            // delete href to deactivate navigation
            delete extendedProps.href
            return <InstallAppButton {...extendedProps} />
        default:
            return <MegaMenuItem {...itemProps} />
    }
}


/**
 * Mega Navigation
 */

const MegaNavigation = ({
    className,
    path,
    root,
    router,
    setNavigationPath
}) => {
    const classes = classNames('c-mega-navigation', className)

    const onPathChange = (path, isLeaf, trigger) => {
        if (trigger !== 'click') {
            return
        }

        if (isLeaf) {
            const routerPath = extractPathFromURL(path, true)

            if (isReactRoute(path)) {
                router.push(routerPath)
            } else {
                window.location.href = path
            }

            setNavigationPath('/')
        } else {
            setNavigationPath(path)
        }
    }

    return (
        <div className={classes}>
            {path &&
                <Nav
                    root={root.title ? root : null}
                    path={path}
                    onPathChange={onPathChange}
                >
                    <MegaMenu itemFactory={itemFactory} />
                </Nav>
            }
        </div>
    )
}


MegaNavigation.propTypes = {
    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    isLoggedIn: PropTypes.bool,

    path: PropTypes.string,

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
}

const mapStateToProps = createPropsSelector({
    path: selectors.getPath,
    root: selectors.getNavigationRoot,
    isLoggedIn: getIsLoggedIn
})

const mapDispatchToProps = {
    setNavigationPath
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(MegaNavigation))
