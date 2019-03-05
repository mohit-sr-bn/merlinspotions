/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as ReduxForm from 'redux-form'
import classNames from 'classnames'

import {setShowAddNewAddress, onSavedShippingAddressChange} from '../actions'
import {ADD_NEW_ADDRESS_FIELD, SAVED_SHIPPING_ADDRESS_FIELD} from '../constants'
import {getIsLoggedIn, getSavedAddresses} from 'progressive-web-sdk/dist/store/user/selectors'
import {getShowAddNewAddress} from '../selectors'

import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import ShippingAddressFields from './shipping-address-fields'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import SavedAddress from './saved-address'

import {FormattedText} from '../../../components/intl/index'

const FormOrSavedAddresses = ({
    isLoggedIn,
    savedAddresses,
    showAddNewAddress,
    handleShowAddNewAddress,
    onSavedShippingAddressChange
}) => {
    if (isLoggedIn && !!savedAddresses.length) {
        const classes = classNames('t-checkout-payment__add-new-address', {
            'u-border-light u-padding-md': showAddNewAddress
        })

        return [
            savedAddresses.map((address) => <SavedAddress key={address.id} address={address} />),
            <FieldRow key={ADD_NEW_ADDRESS_FIELD} className={classes}>
                <div className="u-flex">
                    <ReduxForm.Field
                        component={Field}
                        name={SAVED_SHIPPING_ADDRESS_FIELD}
                        label={
                            <strong className="u-text-weight-semi-bold">
                                <FormattedText messageId="checkoutShipping.form.addNewAddress" />
                            </strong>
                        }
                        type="radio"
                        value={ADD_NEW_ADDRESS_FIELD}
                        customEventHandlers={{
                            onChange: () => {
                                handleShowAddNewAddress(true)

                                // Reset checkout shippingAddress and defaultShippingAddressId
                                onSavedShippingAddressChange()
                            }
                        }}
                    >
                        <input
                            type="radio"
                            noValidate
                            value={ADD_NEW_ADDRESS_FIELD}
                            data-analytics-name={UI_NAME.addNewAddress}
                        />
                    </ReduxForm.Field>

                    {showAddNewAddress &&
                        <div className="t-checkout-payment__add-new-address-form">
                            <ShippingAddressFields />
                        </div>
                    }
                </div>
            </FieldRow>
        ]
    } else {
        return <ShippingAddressFields />
    }
}

FormOrSavedAddresses.propTypes = {
    /**
     * Whether the form is disabled or not
     */
    disabled: PropTypes.bool,

    /**
    * The title for the form
    */
    formTitle: PropTypes.string,

    /**
     * Handles whether or not to show the "Add New Address" form fields
     */
    handleShowAddNewAddress: PropTypes.func,

    /**
    * (Internal) added by redux form
    */
    invalid: PropTypes.bool,

    /**
     * Whether the user is logged in or not
     */
    isLoggedIn: PropTypes.bool,

    /**
    * Saved addresses from the user's account
    */
    savedAddresses: PropTypes.array,

    /**
    * Whether or not to show the "Add New Addres" form fields
    */
    showAddNewAddress: PropTypes.bool,

    /**
    * (Internal) Added by redux form
    */
    submitting: PropTypes.bool,

    /**
     * Fetch shipping methods on saved address selection change
     */
    onSavedShippingAddressChange: PropTypes.func,
}

const mapStateToProps = createPropsSelector({
    isLoggedIn: getIsLoggedIn,
    savedAddresses: getSavedAddresses,
    showAddNewAddress: getShowAddNewAddress
})

const mapDispatchToProps = {
    handleShowAddNewAddress: setShowAddNewAddress,
    onSavedShippingAddressChange
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormOrSavedAddresses)
