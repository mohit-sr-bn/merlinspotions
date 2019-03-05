/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import template from '../../template'
import PageMeta from '../../components/page-meta'

import ListTile from 'progressive-web-sdk/dist/components/list-tile'
import List from 'progressive-web-sdk/dist/components/list'
import Icon from 'progressive-web-sdk/dist/components/icon'

import {
    getAccountAddressURL,
    getAccountInfoURL,
    getAccountOrderListURL,
    getWishlistURL,
    isRunningInAstro
} from '../app/selectors'

import {getAccountDashboardPageMeta} from './selectors'
import {initialize} from './actions'
import {signOut} from '../app/actions'

const DashboardLinks = ({link: {text, href, onClick}}) => {
    return (
        <ListTile
            className="t-account-dashboard__link"
            href={href}
            onClick={onClick}
            endAction={<Icon name="chevron-right" />}
        >
            <div>{text}</div>
        </ListTile>
    )
}

DashboardLinks.propTypes = {
    link: PropTypes.shape({
        href: PropTypes.string,
        text: PropTypes.string
    })
}


const AccountDashboard = ({
    addressUrl,
    accountInfoUrl,
    wishlistUrl,
    orderListUrl,
    pageMeta,
    signOut,
    isRunningInAstro
}) => {
    const links = [
        {
            text: 'Account Information',
            href: accountInfoUrl
        },
        {
            text: 'Address Book',
            href: addressUrl
        },
        {
            text: 'My Orders',
            href: orderListUrl
        },
        {
            text: 'My Wish List',
            href: wishlistUrl
        },
        {
            text: 'My Subscriptions',
            href: '/newsletter/manage/'
        }
    ]

    if (isRunningInAstro) {
        links.push({
            text: 'Sign Out',
            href: '#',
            onClick: signOut
        })
    }

    return (
        <div className="t-account-dashboard">
            <PageMeta {...pageMeta} />

            <h1 className="t-account-dashboard__title u-padding-md u-text-uppercase">
                My Dashboard
            </h1>

            <List className="u-bg-color-neutral-00 u-border-bottom u-border-top">
                {links.map((link, idx) =>
                    <DashboardLinks link={link} key={idx} />
                )}
            </List>
        </div>
    )
}

AccountDashboard.propTypes = {
    accountInfoUrl: PropTypes.string,
    addressUrl: PropTypes.string,
    isRunningInAstro: PropTypes.bool,
    orderListUrl: PropTypes.string,
    pageMeta: PropTypes.object,
    signOut: PropTypes.func,
    wishlistUrl: PropTypes.string
}

AccountDashboard.initAction = initialize

const mapStateToProps = createPropsSelector({
    addressUrl: getAccountAddressURL,
    accountInfoUrl: getAccountInfoURL,
    orderListUrl: getAccountOrderListURL,
    pageMeta: getAccountDashboardPageMeta,
    wishlistUrl: getWishlistURL,
    isRunningInAstro
})

const mapDispatchToProps = {
    signOut
}

export default template(connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountDashboard))
