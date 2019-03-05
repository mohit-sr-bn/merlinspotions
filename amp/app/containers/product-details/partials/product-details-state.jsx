/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

// Selectors
import {getProductVariants} from 'progressive-web-sdk/dist/store/products/selectors'

// Components
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'
import State from 'mobify-amp-sdk/dist/components/state'

const parseVariant = (variant) => {
    if (!variant) {
        return {}
    } else {
        return {
            available: variant.available,
            id: variant.id,
            color: variant.values && variant.values.color,
            size: variant.values && variant.values.size,
            attributeIds: {
                color: (variant.attributeIds && variant.attributeIds.color) || '',
                size: (variant.attributeIds && variant.attributeIds.size) || '',
            }
        }
    }
}

const ProductDetailsState = ({variants}) => {
    const firstVariant = parseVariant(variants[0]) || {}

    // It's necessary to separate these chunks into their own states, because
    // selecting values deep in a single state bloats the operand count beyond
    // AMP's limitation of 50 operands. See their expression docs:
    // https://www.ampproject.org/docs/reference/components/amp-bind#expressions
    const ampAttributeIdsState = firstVariant.attributeIds || {}
    const ampCurrentVariantState = {
        value: `${firstVariant.color || 'undefined'}-${firstVariant.size || 'undefined'}`,
        color: firstVariant.color || 'undefined',
        size: firstVariant.size || 'undefined'
    }
    const ampVariantsState = {}

    // Map the variants into a structure that will make it easy to select one
    variants.forEach((variant) => {
        const parsedVariant = parseVariant(variant)
        delete parsedVariant.attributeIds // these won't change between variants
        ampVariantsState[`${parsedVariant.color}-${parsedVariant.size}`] = parsedVariant
    })

    const innerHTML = `
        <div>
            <amp-bind-macro
                id="getCurrentVariantId"
                expression="productVariants[currentVariant.value].id"
            /></amp-bind-macro>
        </div>
    `

    return (
        <div>
            <State namespace="attributeIds" data={ampAttributeIdsState} />
            <State namespace="currentVariant" data={ampCurrentVariantState} />
            <State namespace="productVariants" data={ampVariantsState} />
            <div dangerouslySetInnerHTML={{__html: innerHTML}} />
        </div>
    )
}

ProductDetailsState.propTypes = {
    variants: PropTypes.array
}

const mapStateToProps = createPropsSelector({
    variants: getProductVariants,
})

export default ampComponent(
    connect(
        mapStateToProps
    )(ProductDetailsState)
)
