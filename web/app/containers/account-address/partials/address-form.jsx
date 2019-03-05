/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as ReduxForm from 'redux-form'

import Button from 'progressive-web-sdk/dist/components/button'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {ADDRESS_FORM_NAME} from '../../../store/form/constants'
import {validatePostalCode} from 'progressive-web-sdk/dist/utils/validation'
import {getIsEditing} from '../selectors'
import {submitAddAddress, submitEditAddress} from '../actions'
import AccountAddressFields from './account-address-fields'

const REQUIRED_TEXT = 'Required'

const validate = (values, props) => {
    const errors = {}
    const requiredFieldNames = [
        'name',
        'addressLine1',
        'city',
        'countryId',
        'region',
        'postcode',
        'telephone'
    ]

    if (values.countryId && values.postcode && !validatePostalCode(values.postcode, values.countryId.toUpperCase())) {
        errors.postcode = 'Enter a valid postal code'
    }

    requiredFieldNames.forEach((fieldName) => {
        if (!values[fieldName]) {
            errors[fieldName] = REQUIRED_TEXT
        }
    })

    return errors
}

export const AccountAddressForm = ({handleSubmit, submitAddAddress, closeAddressModal, isEditing, submitEditAddress}) => {
    return (
        <form id={ADDRESS_FORM_NAME} data-analytics-name={UI_NAME.address} onSubmit={handleSubmit(isEditing ? submitEditAddress : submitAddAddress)} noValidate>
            <AccountAddressFields />
            <div className="u-padding-md">
                <Button
                    className="pw--primary u-width-full u-margin-bottom-md"
                    type="submit"
                    text="Save"
                    data-analytics-name={UI_NAME.confirmation}
                />
                <Button
                    className="pw--tertiary u-width-full"
                    type="button"
                    text="Cancel"
                    onClick={closeAddressModal}
                    data-analytics-name={UI_NAME.cancel}
                />
            </div>
        </form>
    )
}

AccountAddressForm.propTypes = {
    closeAddressModal: PropTypes.func,
    /**
     * Redux-form internal
     */
    handleSubmit: PropTypes.func,
    /**
     * State of whether modal is edit or adding address
     */
    isEditing: PropTypes.bool,
    /**
    * Submits the address form information to the server for adding
    */
    submitAddAddress: PropTypes.func,
    /**
    * Submits the address form information to the server for editing
    */
    submitEditAddress: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    isEditing: getIsEditing
})

const mapDispatchToProps = {
    submitAddAddress,
    submitEditAddress
}


const AccountAddressReduxForm = ReduxForm.reduxForm({
    form: ADDRESS_FORM_NAME,
    validate
})(AccountAddressForm)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountAddressReduxForm)
