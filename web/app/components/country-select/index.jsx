/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import * as ReduxForm from 'redux-form'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import classNames from 'classnames'

import Field from 'progressive-web-sdk/dist/components/field'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {getCountries} from '../../store/checkout/selectors'

import {FormattedText} from '../intl/index'


/**
 * A field for selecting a country.
 */

const CountrySelect = ({
    className,
    countries
}) => {
    const classes = classNames('c-country-select', 'pw--has-select', className)

    return (
        <ReduxForm.Field
            className={classes}
            component={Field}
            name="countryId"
            label={<FormattedText messageId="checkoutShipping.form.label.country" />}
        >
            <select data-analytics-name={UI_NAME.country}>
                {countries.map(({label, id}) => (
                    <option value={id} key={id}>
                        {label}
                    </option>
                ))}
            </select>
        </ReduxForm.Field>
    )
}


CountrySelect.defaultProps = {
    countries: []
}

CountrySelect.propTypes = {
    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    /**
     * A list of the countries to be included
     */
    countries: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        id: PropTypes.string
    }))
}

const mapStateToProps = createPropsSelector({
    countries: getCountries
})

export default connect(mapStateToProps)(CountrySelect)
