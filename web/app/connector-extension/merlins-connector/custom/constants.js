/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {
    ACCOUNT_ADDRESS_URL,
    MY_ACCOUNT_URL,
    ACCOUNT_ORDER_LIST_URL,
    SIGN_IN_URL,
    CREATE_ACCOUNT_URL,
    ACCOUNT_INFO_URL,
    WISHLIST_URL
} from '../../../connectors/_merlins-connector/config'

export const URL_CONTAINER_MAP = {
    account: MY_ACCOUNT_URL,
    accountAddress: ACCOUNT_ADDRESS_URL,
    accountOrderList: ACCOUNT_ORDER_LIST_URL,
    accountInfo: ACCOUNT_INFO_URL,
    signin: SIGN_IN_URL,
    register: CREATE_ACCOUNT_URL,
    wishlist: WISHLIST_URL
}
