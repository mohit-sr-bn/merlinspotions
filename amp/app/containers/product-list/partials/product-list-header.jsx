/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

// Components
import Img from 'mobify-amp-sdk/dist/components/img'
import Breadcrumbs from 'mobify-amp-sdk/dist/components/breadcrumbs'

// Selectors
import * as selectors from 'web/app/containers/product-list/selectors'

// Utils
import {canonicalURL, staticURL} from '../../../utils'

const ProductListHeader = ({category, categoryPath = []}) => (
    <div className="u-flexbox u-align-bottom">
        <div className="u-flex u-padding-top-lg u-padding-bottom-lg u-padding-start-md">
            {categoryPath.length > 0 &&
                <div className="t-product-list__breadcrumb">
                    <Breadcrumbs
                        items={categoryPath.map(({title, href}) => ({text: title, href: canonicalURL(href || '')}))}
                        includeMicroData
                    />
                </div>
            }
            <div className="u-margin-top-md">
                <h1 className="u-text-uppercase">{category.title}</h1>
            </div>
        </div>

        {category &&
            <Img
                className="u-flex-none u-padding-end u-padding-bottom-sm"
                alt="Heading logo"
                height="60"
                width="60"
                src={staticURL(`img/categories/${category.title.trim().replace(/\s+/g, '-')
                .toLowerCase()}@2x.png`)}
                layout="fixed"
            />
        }
    </div>
)

ProductListHeader.propTypes = {
    category: PropTypes.object,
    categoryPath: PropTypes.array
}

const mapStateToProps = createPropsSelector({
    category: selectors.getCategory,
    categoryPath: selectors.getCategoryPath
})

export default connect(mapStateToProps)(ProductListHeader)
