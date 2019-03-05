/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {Field as ReduxFormField} from 'redux-form'
import classNames from 'classnames'

import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'

/**
 * This component is used to add extra form fields programmatically to the scaffold
 */
const ExtraField = ({extraFields, name, className}) => {
    const classes = classNames('c-extra-field', className)

    const field = extraFields.find((field) => field.name === name)

    // Skip rendering the field if the requested name doesn't exist
    if (!field) {
        console.log(`Extra field '${name}' doesn't exist. Will not render <ExtraField /> for it.`)
        return null
    }

    const {type, label, analyticsName, options} = field
    let Children

    if (type === 'select') {
        Children = (
            <select className="pw--has-select" data-analytics-name={analyticsName}>
                {options.map((value, index) =>
                    <option key={index} value={value.code}>{value.name}</option>
                )}
            </select>
        )
    } else {
        Children = <input type={type} data-analytics-name={analyticsName} />
    }

    return (<FieldRow>
        <ReduxFormField
            name={name}
            label={label}
            component={Field}
            className={classes}
            >
            {Children}
        </ReduxFormField>
    </FieldRow>)
}

ExtraField.propTypes = {
    extraFields: PropTypes.arrayOf(PropTypes.shape({
        analyticsName: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['select', 'input']).isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            code: PropTypes.string,
            name: PropTypes.string
        }))
    })).isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
}

export default ExtraField
