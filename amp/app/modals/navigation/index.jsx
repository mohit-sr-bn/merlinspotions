/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import URL from 'url'
import {canonicalURL} from '../../utils'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'

// Components
import Sheet from 'mobify-amp-sdk/dist/components/sheet'
import Nav from 'mobify-amp-sdk/dist/components/nav'
import NavMenu from 'mobify-amp-sdk/dist/components/nav-menu'
import NavItem from 'mobify-amp-sdk/dist/components/nav-item'
import {HeaderBar, HeaderBarActions, HeaderBarTitle} from 'mobify-amp-sdk/dist/components/header-bar'
import Icon from 'mobify-amp-sdk/dist/components/icon'
import IconLabelButton from '../../components/icon-label-button'

// Partials
import NavigationSocialIcons from './partials/navigation-social-icons'

// Selectors
import {getNavigationRoot, getPath} from './selectors'

const pathnameMatch = (url, pathname) => Boolean(url && URL.parse(url).pathname === pathname)

const itemFactory = (type, componentProps) => {
    // Login has a special nav item
    if (pathnameMatch(componentProps.href, '/customer/account/login/')) {
        return <SignInListItem {...componentProps} href={canonicalURL(componentProps.href)} />
    }
    return <NavItem {...componentProps} href={canonicalURL(componentProps.href)} />
}

const SignInListItem = (props) => (
    <NavItem {...props}
        className="u-bg-color-neutral-10"
        beforeContent={
            <Icon className="m-navigation__sign-in-icon" name="user" title="User" />
        }
    />
)

const Navigation = (props) => {
    const {sheetId, root, path} = props
    const closeNav = `tap:${sheetId}.toggle`

    return (
        <Sheet id={sheetId} className="m-navigation">
            <Nav>
                <HeaderBar>
                    <HeaderBarTitle className="u-flex u-padding-start u-text-align-start">
                        <h2 className="u-text-family-header u-text-uppercase">
                            <span className="u-text-weight-extra-light">Menu</span>
                        </h2>
                    </HeaderBarTitle>

                    <HeaderBarActions>
                        <IconLabelButton iconName="close" label="close" on={closeNav} />
                    </HeaderBarActions>
                </HeaderBar>

                <NavMenu root={root} path={path} itemFactory={itemFactory} />

                <div>
                    <NavigationSocialIcons />
                    <div className="m-navigation__copyright u-padding-md">
                        <p>© 2018 Mobify Research & Development Inc. All rights reserved.</p>
                    </div>
                </div>
            </Nav>
        </Sheet>
    )
}

Navigation.propTypes = {
    path: PropTypes.string,
    root: PropTypes.object,
    sheetId: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    root: getNavigationRoot,
    path: getPath
})

export default ampComponent(
    connect(mapStateToProps)(Navigation)
)
