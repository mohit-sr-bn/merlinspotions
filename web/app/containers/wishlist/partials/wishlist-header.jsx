/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import PageMeta from '../../../components/page-meta'

import {getAccountURL} from '../../app/selectors'

import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'

import {
    getWishlistItemCount,
    getWishlistTitle
} from 'progressive-web-sdk/dist/store/user/selectors'
import {getWishlistPageMeta} from '../selectors'

const WishlistHeader = ({
    dashboardURL,
    itemCount,
    title,
    pageMeta
}) => (
    <div className="u-padding-top-lg u-padding-bottom-lg u-padding-start-md u-padding-end-md u-border-light-bottom">
        <PageMeta {...pageMeta} />

        <div>
            <Breadcrumbs items={[{text: 'Back to Dashboard', href: dashboardURL}]} />
        </div>

        <div className="u-margin-top-md">
            <h1 className="t-wishlist__title u-text-uppercase">
                {title} ({itemCount} Items)
            </h1>
        </div>
    </div>
)

WishlistHeader.propTypes = {
    dashboardURL: PropTypes.string,
    itemCount: PropTypes.number,
    pageMeta: PropTypes.object,
    title: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    dashboardURL: getAccountURL,
    itemCount: getWishlistItemCount,
    pageMeta: getWishlistPageMeta,
    title: getWishlistTitle,
})

export default connect(
    mapStateToProps
)(WishlistHeader)
