/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import classNames from 'classnames'
import find from 'lodash.find'
import PropTypes from 'prop-types'
import * as ReduxForm from 'redux-form'
import {connect} from 'react-redux'

import {onVariationChange} from '../actions'

// Components
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import {Swatch, SwatchItem} from 'progressive-web-sdk/dist/components/swatch'

const variationSwatch = ({input: {value, onChange}, values, label, error, name, onVariationChange}) => { // eslint-disable-line
    const handleChange = (val) => {
        onChange(value = val)
        onVariationChange()
    }

    const chosenSwatch = find(values, {value})

    const swatchClasses = classNames({
        'pw-swatch__error': error && !value
    })

    return (
        <Swatch
            label={`${label}: ${chosenSwatch.label}`}
            onChange={handleChange}
            value={value}
            className={swatchClasses}
        >
            {values.map(({label, value}) =>
                <SwatchItem key={value}
                    value={value}
                    analyticsName={name}
                    analyticsContent={label}
                >
                    {label}
                </SwatchItem>
            )}
            {error && !value &&
                <div className="pw-swatch__error">{error[name]}</div>
            }
        </Swatch>
    )
}

variationSwatch.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.string,
        onChange: PropTypes.func
    }),
    label: PropTypes.string,
    values: PropTypes.array
}

const ProductDetailsVariations = ({variations, error, onVariationChange}) => {

    return (
        <div className="t-product-details__variations">
            {variations.map(({id, name, label, values = []}) => (
                <FieldRow key={id} error={error}>
                    <ReduxForm.Field
                        label={label}
                        name={name}
                        values={values}
                        error={error}
                        component={variationSwatch}
                        onVariationChange={onVariationChange}
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
    })),
    onVariationChange: PropTypes.func
}


const mapDispatchToProps = {
    onVariationChange
}

export default connect(
    null,
    mapDispatchToProps
)(ProductDetailsVariations)
