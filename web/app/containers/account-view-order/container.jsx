/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import template from '../../template'
import {initialize} from './actions'
import AccountViewOrderHeader from './partials/account-view-order-header'
import OrderTotals from './partials/order-totals'
import OrderItems from './partials/order-items'
import OrderInformation from './partials/order-information'
import ReorderButton from './partials/reorder-button'
import PrintButton from './partials/print-button'


const AccountViewOrder = () => (
    <div className="t-account-view-order">
        <AccountViewOrderHeader />
        <div className="t-account-view-order__content u-padding-top-md u-padding-bottom-md">
            <h3 className="t-account-view-order__heading u-padding-start-md u-padding-top-lg u-padding-bottom-lg">Items Ordered</h3>
            <OrderItems />
            <OrderTotals />
            <ReorderButton />
            <h3 className="t-account-view-order__heading u-padding-start-md u-padding-top-lg u-padding-bottom-lg">Order Information</h3>
            <OrderInformation />
            <PrintButton />
        </div>
    </div>
)

AccountViewOrder.initAction = initialize

export default template(AccountViewOrder)
