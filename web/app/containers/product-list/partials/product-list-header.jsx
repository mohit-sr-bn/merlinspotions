/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import * as selectors from '../selectors'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'

import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'
import Image from 'progressive-web-sdk/dist/components/image'
import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'

import PageMeta from '../../../components/page-meta'

const ProductListHeader = ({
    category,
    categoryPath = []
}) => (
    <div className="u-flexbox u-align-bottom">
        {category &&
            <PageMeta {...category.pageMeta} />
        }

        <div className="u-flex u-padding-top-lg u-padding-bottom-lg u-padding-start-md">
            {categoryPath.length > 0 &&
                <div className="t-product-list__breadcrumb">
                    <Breadcrumbs
                        items={categoryPath.map(({title, href}) => ({text: title, href}))}
                        includeMicroData />
                </div>
            }

            <div className="u-margin-top-md">
                {category ?
                    <h1 className="u-text-uppercase">{category.title}</h1>
                :
                    <SkeletonText lines={1} type="h1" width="100px" />
                }
            </div>
        </div>

        {category &&
            <Image
                className="u-flex-none u-padding-end u-padding-bottom-sm"
                alt="Heading logo"
                height="60px"
                width="60px"
                src={
                    getAssetUrl(`static/img/categories/${category.title.trim().replace(/\s+/g, '-')
                        .toLowerCase()}@2x.png`)
                }
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
