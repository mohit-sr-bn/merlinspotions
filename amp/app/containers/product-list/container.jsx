/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'
import {CURRENT_URL} from 'progressive-web-sdk/dist/store/app/constants'
import {FILTER_SHEET} from '../../modals/constants'

// Partials
import ProductListHeader from './partials/product-list-header'
import ProductListContents from './partials/product-list-contents'

import {initialize} from './actions'

const ProductList = () => {
    return (
        <div className="t-product-list">
            <ProductListHeader />

            <ProductListContents sheetId={FILTER_SHEET} /> {/* TODO FIX HOW TO WORK WITH route name eg. <ProductListContents routeName={routeName} /> */}
        </div>
    )
}

ProductList.propTypes = {
    // Route object added by react router
    route: PropTypes.object
}

ProductList.resolves = [({dispatch, getState}) => {
    return dispatch(initialize(getState().app.get(CURRENT_URL)))
}]

ProductList.templateName = 'plp'

const mapStateToProps = createPropsSelector({})

export default ampComponent(connect(mapStateToProps)(ProductList))
