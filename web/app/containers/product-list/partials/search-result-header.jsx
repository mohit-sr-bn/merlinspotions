/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

// import {getCategorySearchTerm} from '../../../store/categories/selectors'
import * as selectors from '../selectors'

import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'
import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'

const items = [
    {
        text: 'Home',
        href: '/'
    }
]

const SearchResultHeader = ({productSearch}) => (
    <div className="u-flexbox u-align-bottom">
        <div className="u-flex u-padding-top-lg u-padding-bottom-lg u-padding-start-md">
            <Breadcrumbs items={items} includeMicroData />
            <div className="u-margin-top-md">
                {productSearch ?
                    <h1 className="u-text-uppercase">
                        <span>Results For </span>
                        <span className="u-text-weight-light">'{productSearch.query}'</span>
                    </h1>
                :
                    <SkeletonText lines={1} type="h1" width="100px" />
                }
            </div>
        </div>
    </div>
)

SearchResultHeader.propTypes = {
    productSearch: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    productSearch: selectors.getProductSearch,
})

export default connect(mapStateToProps)(SearchResultHeader)
