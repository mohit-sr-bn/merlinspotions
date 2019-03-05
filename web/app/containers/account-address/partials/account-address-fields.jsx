/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import * as ReduxForm from 'redux-form'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {normalizePhone} from 'progressive-web-sdk/dist/utils/normalize-utils'
import CountrySelect from '../../../components/country-select'
import RegionField from '../../../components/region-field'
import {getAvailableRegions} from '../../../store/checkout/selectors'
import {ADDRESS_FORM_NAME} from '../../../store/form/constants'

import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import Field from 'progressive-web-sdk/dist/components/field'
import {getIsDefaultAddressFromId} from '../selectors'

const AccountAddressFields = ({
    regions,
    isDefault
}) => {
    return (
        <div className="u-padding-md">
            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="name"
                    label="First & Last Name"
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.customerName} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="addressLine1"
                    label="Address"
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.address} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="company"
                    label="Company"
                >
                    <input
                        type="text"
                        noValidate
                        placeholder="Optional"
                        data-analytics-name={UI_NAME.company}
                    />
                </ReduxForm.Field>

                <ReduxForm.Field
                    component={Field}
                    name="addressLine2"
                    label="Apt #, suite etc."
                >
                    <input
                        type="text"
                        noValidate
                        placeholder="Optional"
                        data-analytics-name={UI_NAME.additionalAddressInfo}
                    />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="city"
                    label="City"
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.city} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <CountrySelect />
            </FieldRow>

            <FieldRow>
                <RegionField regions={regions} />
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="postcode"
                    label="Zip/Postal Code"
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.postcode} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="telephone"
                    label="Phone"
                    normalize={normalizePhone}
                >
                    <input type="tel" noValidate data-analytics-name={UI_NAME.phone} />
                </ReduxForm.Field>
            </FieldRow>
            {isDefault ?
                <div className="u-padding-top-md u-text-weight-semi-bold">Default Address</div>
            :
                <FieldRow>
                    <ReduxForm.Field
                        component={Field}
                        name="preferred"
                        type="checkbox"
                        label={<p>Use as my default address</p>}
                    >
                        <input type="checkbox" noValidate data-analytics-name={UI_NAME.setDefault} />
                    </ReduxForm.Field>
                </FieldRow>
            }

        </div>
    )
}

AccountAddressFields.propTypes = {
    isDefault: PropTypes.bool,
    regions: PropTypes.arrayOf(PropTypes.shape({
        country_id: PropTypes.string,
        label: PropTypes.string,
        title: PropTypes.string,
        value: PropTypes.string
    }))
}

const mapStateToProps = createPropsSelector({
    isDefault: getIsDefaultAddressFromId,
    regions: getAvailableRegions(ADDRESS_FORM_NAME)
})


export default connect(
    mapStateToProps
)(AccountAddressFields)
