/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getProductInitialValues, getProductVariants} from 'progressive-web-sdk/dist/store/products/selectors'
import classNames from 'classnames'

// Components
import {Swatch, SwatchItem} from 'mobify-amp-sdk/dist/components/swatch'


const VariationSwatch = ({
    values,
    initialValues,
    variants,
    label,
    error,
    name,
}) => {
    const bySizeAndColor = ({values}) => {
        return (values.color === initialValues.color) && (values.size === initialValues.size)
    }
    const hasProducts = (variation) => {
        return variation.products.length
    }
    const categoryLabel = label.toLowerCase()
    const filteredValue = variants.filter(bySizeAndColor)[0]
    const categoryValue = filteredValue.id

    const swatchClasses = classNames({
        'pw-swatch__error': error && !categoryValue
    })

    return (
        <Swatch
            label={label}
            value={categoryValue}
            className={swatchClasses}
        >
            {values.filter(hasProducts).map((valueProps) => {
                const {label, value, products} = valueProps
                const index = products.indexOf(categoryValue)
                const variant = products[index]

                // `setValueFor` returns either the variant value that the
                // current swatch will set, or the variant value that needs to
                // stay the same because the current swatch won't change it.
                //
                // For example, clicking the "Red" swatch should change the
                // `color` value, but leave the `size` value unchanged.
                const setValueFor = (label) => {
                    return (categoryLabel === label)
                        ? value
                        : `" + (currentVariant.${label} || 'undefined') + "`
                }

                return (
                    <SwatchItem
                        key={value}
                        value={variant}
                        option={value}
                        on={`
                            tap:AMP.setState({
                                currentVariant: {
                                    value: "${setValueFor('color')}-${setValueFor('size')}",
                                    color: "${setValueFor('color')}",
                                    size: "${setValueFor('size')}",
                                }
                            })
                        `}
                        data-vars-analytics-action="userClickButton"
                        data-vars-analytics-name={`swatch:${categoryLabel}:${label}`}
                    >
                        {label}
                    </SwatchItem>
                )
            })}

            {error && !categoryValue &&
                <div className="pw-swatch__error">{error[name]}</div>
            }
        </Swatch>
    )
}

VariationSwatch.propTypes = {
    error: PropTypes.object,
    initialValues: PropTypes.object,
    label: PropTypes.string,
    name: PropTypes.string,
    values: PropTypes.array,
    variants: PropTypes.array
}

const mapStateToProps = createPropsSelector({
    initialValues: getProductInitialValues,
    variants: getProductVariants
})

export default connect(mapStateToProps)(VariationSwatch)
