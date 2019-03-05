/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getProductVariationCategories} from 'progressive-web-sdk/dist/store/products/selectors'
import classNames from 'classnames'

// Components
import VariationSwatch from './product-details-swatches'
import FieldRow from 'mobify-amp-sdk/dist/components/field-row'


const ProductDetailsVariations = ({variations, error}) => {
    const classes = classNames({
        'u-margin-top-lg': variations.length > 0
    })

    return (
        <div className={classes}>
            {variations.map(({id, name, label, values = []}) => (
                <FieldRow key={id} error={error}>
                    <VariationSwatch
                        label={label}
                        name={name}
                        values={values}
                        error={error}
                    />
                </FieldRow>
            ))}
        </div>
    )
}

ProductDetailsVariations.propTypes = {
    error: PropTypes.object,
    variations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        }))
    }))
}

const mapStateToProps = createPropsSelector({
    variations: getProductVariationCategories
})

export default connect(
    mapStateToProps
)(ProductDetailsVariations)
