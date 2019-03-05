/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import Immutable from 'immutable'

import {getUi} from '../../store/selectors'

import {
    getSavedAddresses,
    getDefaultAddress
} from 'progressive-web-sdk/dist/store/user/selectors'


export const getAccountAddress = createSelector(
    getUi,
    ({accountAddress}) => accountAddress
)

export const getAddressID = createGetSelector(getAccountAddress, 'addressID')

export const getAddressPageMeta = createGetSelector(getAccountAddress, 'pageMeta', Immutable.Map())

export const getIsEditing = createGetSelector(getAccountAddress, 'isEdit')

export const getAddressFromId = createSelector(
    getAddressID,
    getSavedAddresses,
    (addressId, addresses) => {
        const address = addresses.find((address) => address.get('id') === addressId)

        return address ? address
            .set('name', address.get('fullname') || `${address.get('firstname')} ${address.get('lastname')}`)
            .set('addressName', address.get('id')) : {}
    })

export const getIsDefaultAddressFromId = createSelector(
    getAddressID,
    getDefaultAddress,
    (addressId, address) => {
        return (
            address && address.id === addressId)
    })
