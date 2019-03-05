/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import template from '../../template'
import PageMeta from '../../components/page-meta'
import Card from '../../components/card'

import {getAccountURL} from '../app/selectors'

import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'
import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'

import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {
    getOrderList,
    getOrdersPage,
    getOrdersPageMeta,
    getNumOrderPages
} from './selectors'
import {initialize, reorderItems, setOrderListPage, navigateToOrder} from './actions'

import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'
import Pagination from 'progressive-web-sdk/dist/components/pagination'

import OrderBlock from './partials/account-order-block'


const NoOrder = ({dashboardURL}) => (
    <div className="t-account-order-list__empty">
        <div className="t-account-order-list__heading u-padding-top-lg u-padding-bottom-lg u-padding-start-md u-padding-end-md">
            <div className="t-account-order-list__breadcrumb">
                <Breadcrumbs items={[{text: 'Back to Dashboard', href: dashboardURL}]} />
            </div>
            <div className="u-margin-top-md">
                <h1 className="t-account-order-list__title u-text-uppercase u-width-1of2">My Orders</h1>
            </div>
        </div>
        <div className="u-padding-md u-margin-top-lg u-flexbox u-direction-column u-align-center u-justify-center">
            <Icon
                name="empty"
                className="u-color-brand"
                size="huge"
                title="Empty"
            />
            <div className="u-text-align-center u-padding-lg">
                You have placed no orders.
            </div>
        </div>
    </div>
)

NoOrder.propTypes = {
    dashboardURL: PropTypes.string,
}

const AccountOrderList = ({
    reorderItems,
    dashboardURL,
    orders,
    pageMeta,
    setOrderListPage,
    navigateToOrder,
    currentPage,
    numOfOrderPages
}) => {
    return (
        <div>
            <PageMeta {...pageMeta} />

            {orders.length ?
                <div className="t-account-order-list">
                    <div className="t-account-order-list__headings u-padding-top-lg u-padding-bottom-lg u-padding-start-md u-padding-end-md">
                        <div className="t-account-order-list__breadcrumb">
                            <Breadcrumbs items={[{text: 'Back to Dashboard', href: dashboardURL}]} />
                        </div>
                        <div className="u-margin-top-md">
                            <h1 className="t-account-order-list__title u-text-uppercase u-width-1of2">My Orders</h1>
                        </div>
                    </div>
                    <div className="t-account-order-list__content u-padding-md">
                        {orders.map((order, id) => (
                            <Card
                                hasBorder
                                key={id}
                                header={
                                    <div>
                                        {order.orderNumber ?
                                            <h3 className="u-padding-top-md u-padding-start-md u-padding-end-md">Order # {order.orderNumber}</h3>
                                        :
                                            <SkeletonText className="u-padding-top-md u-padding-start-md u-padding-end-md" width="40%" style={{lineHeight: '20px', display: 'block'}} />
                                        }
                                    </div>
                                }
                                children={<OrderBlock {...order} />}
                                footer={
                                    <div className="u-flexbox">
                                        <div className="u-flex u-border-end">
                                            <Button
                                                onClick={() => navigateToOrder(order.orderNumber, order.viewHref)}
                                                type="button"
                                                title="View"
                                                className="u-width-full u-color-brand u-border-top"
                                                icon="review"
                                                showIconText={true}
                                                iconClassName="u-margin-end"
                                                data-analytics-name={UI_NAME.view}
                                            />
                                        </div>
                                        <div className="u-flex">
                                            <Button
                                                type="button"
                                                title="Reorder"
                                                className="u-width-full u-color-brand u-border-top"
                                                icon="cart-v2"
                                                onClick={() => reorderItems(order.id || order.orderNumber)}
                                                showIconText={true}
                                                iconClassName="u-margin-end"
                                                data-analytics-name={UI_NAME.reorder}
                                            />
                                        </div>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                    <Pagination
                        className="u-padding-md"
                        onChange={(pageNumber) => setOrderListPage(pageNumber)}
                        currentPage={currentPage}
                        pageCount={numOfOrderPages}
                        showCurrentPageMessage={true}
                        showPageButtons={false}
                    />
                </div>
            :
                <NoOrder dashboardURL={dashboardURL} />
            }
        </div>
    )
}

AccountOrderList.propTypes = {
    currentPage: PropTypes.number,
    dashboardURL: PropTypes.string,
    navigateToOrder: PropTypes.func,
    numOfOrderPages: PropTypes.number,
    orders: PropTypes.array,
    pageMeta: PropTypes.object,
    reorderItems: PropTypes.func,
    setOrderListPage: PropTypes.func
}

AccountOrderList.initAction = initialize

const mapStateToProps = createPropsSelector({
    currentPage: getOrdersPage,
    dashboardURL: getAccountURL,
    orders: getOrderList,
    pageMeta: getOrdersPageMeta,
    numOfOrderPages: getNumOrderPages
})

const mapDispatchToProps = {
    reorderItems,
    navigateToOrder,
    setOrderListPage
}

export default template(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AccountOrderList)
)
