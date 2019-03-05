/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import template from '../../template'
import {isRunningInAstro} from '../app/selectors'
import ProductListHeader from './partials/product-list-header'
import SearchResultHeader from './partials/search-result-header'
import ProductListContents from './partials/product-list-contents'
import {initialize} from './actions'

const ProductList = ({route: {routeName}, isRunningInAstro}) => {
    return (
        <div className="t-product-list">
            {!isRunningInAstro &&
                <Fragment>
                    {routeName === 'searchResultPage' ?
                        <SearchResultHeader />
                    :
                        <ProductListHeader />
                    }
                </Fragment>
            }
            <ProductListContents routeName={routeName} />
        </div>
    )
}

ProductList.propTypes = {
    isRunningInAstro: PropTypes.bool,
    // Route object added by react router
    route: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    isRunningInAstro
})

ProductList.initAction = initialize

export default template(
    connect(mapStateToProps)(ProductList)
)
