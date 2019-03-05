/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import * as ReduxForm from 'redux-form'
import classNames from 'classnames'

import Field from 'progressive-web-sdk/dist/components/field'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {formatMessage} from '../../components/intl/index'


/**
 * A field for selecting/entering a region for an address.
 *
 * When passed a list of regions (e.g. US states, Canadian provinces),
 * this renders a `select` element to choose between these choices.
 *
 * If the list of regions is empty or absent, it instead renders an
 * `input` element for free-form entry of the region name. (this is
 * used in, e.g. the UK)
 */

const RegionField = ({
    className,
    regions,
    onBlur
}, context) => {
    const classes = classNames('c-region-field', className)

    if (regions.length === 0) {
        return (
            <ReduxForm.Field
                className={classes}
                component={Field}
                name="region"
                label={formatMessage(context, {id: 'checkoutShipping.form.label.region'})}
                customEventHandlers={{onBlur}}
            >
                <input type="text" noValidate data-analytics-name={UI_NAME.region} />
            </ReduxForm.Field>
        )
    }

    return (
        <ReduxForm.Field
            className={classNames(classes, 'pw--has-select')}
            component={Field}
            name="regionId"
            label={formatMessage(context, {id: 'checkoutShipping.form.label.stateProvince'})}
            customEventHandlers={{onBlur}}
        >
            <select data-analytics-name={UI_NAME.region}>
                <option disabled value="">
                    {formatMessage(context, {id: 'checkoutShipping.form.validation.fixStateProvince'})}
                </option>

                {regions.map(({label, id}) => (
                    <option value={id} key={`${id}-${label}`}>
                        {label}
                    </option>
                ))}
            </select>
        </ReduxForm.Field>
    )
}

RegionField.defaultProps = {
    regions: []
}

RegionField.propTypes = {
    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    /**
     * The regions to be included in the select element.
     */
    regions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        id: PropTypes.string
    })),

    /**
     * onBlur callback
     */
    onBlur: PropTypes.func
}

RegionField.contextTypes = {
    intl: PropTypes.object,
}

export default RegionField
