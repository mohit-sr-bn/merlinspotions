/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ReduxForm from 'redux-form'

import {setShowAddNewAddress, onSavedShippingAddressChange} from '../actions'
import {SAVED_SHIPPING_ADDRESS_FIELD} from '../constants'

import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const SavedAddress = (props) => {
    const {
        address,
        handleShowAddNewAddress,
        onSavedShippingAddressChange
    } = props

    const {
        city,
        countryId,
        firstname,
        id,
        lastname,
        postcode,
        regionCode,
        addressLine1,
        addressLine2
    } = address

    const street = [addressLine1, addressLine2].filter((item) => item).join(', ')
    const shippingAddress = (
        <div className="u-color-neutral-40">
            <p className="u-margin-bottom-sm">
                {city}, {regionCode}, {countryId}, {postcode}
            </p>
            <p>{firstname} {lastname}</p>
        </div>
    )

    return (
        <FieldRow key={id}>
            <ReduxForm.Field
                component={Field}
                name={SAVED_SHIPPING_ADDRESS_FIELD}
                label={
                    <strong className="u-text-weight-semi-bold">{street}</strong>
                }
                caption={shippingAddress}
                type="radio"
                value={id}
                customEventHandlers={{
                    onChange: () => {
                        handleShowAddNewAddress(false)
                        onSavedShippingAddressChange(id, address)
                    }
                }}
            >
                <input
                    type="radio"
                    noValidate
                    value={id}
                    data-analytics-name={UI_NAME.savedAddress}
                />
            </ReduxForm.Field>
        </FieldRow>
    )
}

SavedAddress.propTypes = {
    address: PropTypes.object,
    handleShowAddNewAddress: PropTypes.func,
    onSavedShippingAddressChange: PropTypes.func
}

const mapDispatchToProps = {
    handleShowAddNewAddress: setShowAddNewAddress,
    onSavedShippingAddressChange
}

export default connect(
    null,
    mapDispatchToProps
)(SavedAddress)
