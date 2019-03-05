/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as ReduxForm from 'redux-form'
import {normalizePhone} from 'progressive-web-sdk/dist/utils/normalize-utils'
import {stripEvent} from 'progressive-web-sdk/dist/utils/utils'

import {showCompanyAndApt, fetchShippingMethods} from '../actions'
import {getIsCompanyOrAptShown} from '../selectors'
import {SHIPPING_FORM_NAME} from '../../../store/form/constants'
import {getAvailableRegions} from '../../../store/checkout/selectors'

import CountrySelect from '../../../components/country-select'
import RegionField from '../../../components/region-field'
import {
    FormattedText,
    formatMessage
} from '../../../components/intl/index'

import Button from 'progressive-web-sdk/dist/components/button'
import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import Icon from 'progressive-web-sdk/dist/components/icon'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const CompanyButton = ({handleShowCompanyAndApt}) => (
    <Button
        className="pw--is-anchor"
        innerClassName="pw--no-min-height u-padding-0"
        onClick={handleShowCompanyAndApt}
        data-analytics-name={UI_NAME.showMoreAddressFields}
    >
        <span className="u-color-brand u-text-letter-spacing-normal u-text-size-small">
            <FormattedText messageId={'checkoutShipping.button.companyAndApartment'} />
        </span>
        <Icon name="chevron-down" className="u-margin-start-sm u-color-brand" />
    </Button>
)

CompanyButton.propTypes = {
    handleShowCompanyAndApt: PropTypes.func
}


const ShippingAddressFields = ({
    fetchShippingMethods,
    handleShowCompanyAndApt,
    isCompanyOrAptShown,
    regions
}, context) => {
    return (
        <div className="t-checkout-shipping__fields u-margin-top-md">
            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="name"
                    label={<FormattedText messageId={'checkoutShipping.form.label.names'} />}
                    customEventHandlers={{onBlur: fetchShippingMethods}}
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.customerName} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="addressLine1"
                    label={<FormattedText messageId={'checkoutShipping.form.label.address'} />}
                    caption={!isCompanyOrAptShown && <CompanyButton handleShowCompanyAndApt={handleShowCompanyAndApt} />}
                    customEventHandlers={{onBlur: fetchShippingMethods}}
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.address} />
                </ReduxForm.Field>
            </FieldRow>

            {isCompanyOrAptShown &&
                <FieldRow>
                    <ReduxForm.Field
                        component={Field}
                        name="company"
                        label={<FormattedText messageId={'checkoutShipping.form.label.company'} />}
                    >
                        <input
                            type="text"
                            noValidate
                            placeholder={formatMessage(context, {id: 'checkoutShipping.form.optional'})}
                            data-analytics-name={UI_NAME.company}
                        />
                    </ReduxForm.Field>

                    <ReduxForm.Field
                        component={Field}
                        name="addressLine2"
                        label={<FormattedText messageId={'checkoutShipping.form.label.apartment'} />}
                    >
                        <input
                            type="text"
                            noValidate
                            placeholder={formatMessage(context, {id: 'checkoutShipping.form.optional'})}
                            data-analytics-name={UI_NAME.additionalAddressInfo}
                        />
                    </ReduxForm.Field>
                </FieldRow>
            }

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="city"
                    label={<FormattedText messageId={'checkoutShipping.form.label.city'} />}
                    customEventHandlers={{onBlur: fetchShippingMethods}}
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.city} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <CountrySelect />
            </FieldRow>

            <FieldRow>
                <RegionField regions={regions} onBlur={fetchShippingMethods} />
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="postcode"
                    label={<FormattedText messageId={'checkoutShipping.form.label.postalCode'} />}
                    customEventHandlers={{onBlur: fetchShippingMethods}}
                >
                    <input type="text" noValidate data-analytics-name={UI_NAME.postcode} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field
                    component={Field}
                    name="telephone"
                    label={<FormattedText messageId={'checkoutShipping.form.label.phone'} />}
                    caption={<FormattedText messageId={'checkoutShipping.form.caption.contact'} />}
                    normalize={normalizePhone}
                    customEventHandlers={{onBlur: fetchShippingMethods}}
                >
                    <input type="tel" noValidate data-analytics-name={UI_NAME.phone} />
                </ReduxForm.Field>
            </FieldRow>
        </div>
    )
}

ShippingAddressFields.propTypes = {
    /**
    * Fetches the available shipping methods from the back end
    */
    fetchShippingMethods: PropTypes.func,

    /**
     * Shows the "Company" and "Apt #" fields
     */
    handleShowCompanyAndApt: PropTypes.func,

    /**
     * Whether the "Company" and "Apt #" fields display
     */
    isCompanyOrAptShown: PropTypes.bool,

    /**
    * Regions available to ship to
    */
    regions: PropTypes.arrayOf(PropTypes.shape({
        country_id: PropTypes.string,
        label: PropTypes.string,
        title: PropTypes.string,
        value: PropTypes.string
    }))
}

ShippingAddressFields.contextTypes = {
    intl: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    isCompanyOrAptShown: getIsCompanyOrAptShown,
    regions: getAvailableRegions(SHIPPING_FORM_NAME),
})

const mapDispatchToProps = {
    handleShowCompanyAndApt: stripEvent(showCompanyAndApt),
    fetchShippingMethods
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShippingAddressFields)
