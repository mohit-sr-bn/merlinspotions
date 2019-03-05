/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'
import {getLocations} from 'mobify-integration-manager/dist/store/checkout/selectors'

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {closeModal} from '../../modals/actions'
import {splitFullName} from 'progressive-web-sdk/dist/utils/utils'
import {ACCOUNT_ADDRESS_MODAL} from '../../modals/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

export const receiveAccountAddressUIData = createAction('Receive Account Address UI Data')
export const setAddressID = createAction('Set Address ID', ['addressID'])
export const setIsEditing = createAction('Set isEdit', ['isEdit'])

export const initialize = (url, routeName) => (dispatch, getState) => {
    dispatch(IntegrationManager.custom.getPageMetaData(routeName))
        .then((pageMeta) => dispatch(receiveAccountAddressUIData(pageMeta)))
    const locationData = getLocations(getState()).toJS()
    if (!locationData || !locationData.countries) {
        dispatch(IntegrationManager.custom.getLocationData())
    }
    return dispatch(IntegrationManager.account.getSavedAddresses())
}

export const submitAddAddress = (formValues) => (dispatch) => {
    const {firstname, lastname} = splitFullName(formValues.name)
    // Merlin's connector doens't support address names,
    // and SFCC requires an address name.
    // Since we're not showing the addressName field, we need
    // to manually assign an addressName for SFCC to accept the address.
    // Merlin's connector will ignore this value.
    const addressName = Math.random().toString(36).slice(2) // eslint-disable-line

    return dispatch(IntegrationManager.account.addAddress({...formValues, firstname, lastname, addressName}))
        .then(() => dispatch(closeModal(ACCOUNT_ADDRESS_MODAL, UI_NAME.addNewAddress)))
}

export const submitEditAddress = (formValues) => (dispatch) => {
    const {firstname, lastname} = splitFullName(formValues.name)

    return dispatch(IntegrationManager.account.editAddress({...formValues, firstname, lastname}, formValues.id))
        .then(() => dispatch(closeModal(ACCOUNT_ADDRESS_MODAL, UI_NAME.editSavedAddress)))
}

export const removeAddress = (id) => (dispatch) => {
    return dispatch(IntegrationManager.account.deleteAddress(id))
}
