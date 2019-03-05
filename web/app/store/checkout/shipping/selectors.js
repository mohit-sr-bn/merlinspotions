/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import Immutable from 'immutable'
import {createGetSelector} from 'reselect-immutable-helpers'
import {getCheckout} from '../../selectors'
import {getShippingMethods, getEmailAddress} from '../selectors'
import {getShippingSavedAddressID} from '../../form/selectors'
import {getSavedAddresses} from 'progressive-web-sdk/dist/store/user/selectors'

export const getShipping = createGetSelector(getCheckout, 'shipping', Immutable.Map())

export const getShippingCustomContent = createGetSelector(getShipping, 'custom', Immutable.Map())

export const getSelectedSavedShippingAddress = createSelector(
    getSavedAddresses,
    getShippingSavedAddressID,
    (savedAddresses, selectedAddressID) => savedAddresses.find((address) => address.get('id') === selectedAddressID)
)

export const getShippingAddress = createGetSelector(getCheckout, 'shippingAddress', Immutable.Map())
export const getSelectedSavedAddressId = createGetSelector(getCheckout, 'defaultShippingAddressId')
export const getSelectedShippingMethodValue = createGetSelector(getCheckout, 'selectedShippingMethodId', '')

export const getInitialShippingAddress = createSelector(
    getCheckout,
    getEmailAddress,
    getShippingAddress,
    getSelectedSavedAddressId,
    getSelectedShippingMethodValue,
    (checkout, email, address, savedAddressId, shippingMethodId) => {
        address = address.set('shippingMethodId', shippingMethodId)
        if (savedAddressId) {
            return address.set('savedAddress', `${savedAddressId}`)
        }
        return address
    }
)


export const getSelectedShippingMethod = createSelector(
    getShippingMethods,
    getSelectedShippingMethodValue,
    (shippingMethods, selectedMethodValue) => {
        if (!shippingMethods.size) {
            return Immutable.Map()
        }
        const selectedValue = shippingMethods.filter((method) => method.get('id') === selectedMethodValue)
        return selectedValue.size ? selectedValue.get(0) : shippingMethods.get(0)
    })

export const getSelectedShippingRate = createGetSelector(getSelectedShippingMethod, 'cost', '')

export const getSelectedShippingLabel = createGetSelector(getSelectedShippingMethod, 'label', '')

export const getShippingFirstName = createGetSelector(getShippingAddress, 'firstname', '')

export const getShippingLastName = createGetSelector(getShippingAddress, 'lastname', '')

export const getShippingFullName = createSelector(getShippingFirstName, getShippingLastName, (firstName, lastName) => `${firstName} ${lastName}`)

export const getStreet = createGetSelector(getShippingAddress, 'street', Immutable.List())

export const getAddressLineOne = createGetSelector(getShippingAddress, 'addressLine1')

export const getAddressLineTwo = createGetSelector(getShippingAddress, 'addressLine2')

export const getTelephone = createGetSelector(getShippingAddress, 'telephone')

export const getPostcode = createGetSelector(getShippingAddress, 'postcode')

export const getCompany = createGetSelector(getShippingAddress, 'company')

export const getRegionId = createGetSelector(getShippingAddress, 'regionId')

export const getCountryId = createGetSelector(getShippingAddress, 'countryId')

export const getCity = createGetSelector(getShippingAddress, 'city')

export const getIsInitialized = createGetSelector(getShippingAddress, 'isInitialized')

export const getShippingAddressCustomContent = createGetSelector(getShippingAddress, 'custom', Immutable.Map())
