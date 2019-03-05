/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getOrderItems} from 'progressive-web-sdk/dist/store/user/orders/selectors'
import {FormattedPrice} from '../../../components/intl/index'

import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'
import Card from '../../../components/card'

const OrderItems = ({
    items
}) => (
    <div className="">
        {items ?
            items.map(({itemName, price, quantity, options}) => (
                <Card header={itemName} key={itemName} className="u-border-bottom" headerClassName="u-padding-start u-padding-bottom" innerClassName="u-padding-md">
                    <div className="u-flexbox u-align-bottom">
                        <div className="u-flex u-text-height-small u-text-quiet u-padding-start u-padding-bottom">
                            {options &&
                                options.map((option) => (
                                    <p key={option.value}>
                                        {option.label}: {option.value}
                                    </p>
                                ))
                            }
                            <p>Ordered: {quantity}</p>
                        </div>
                        <div className="u-text-align-end u-flex u-text-weight-bold u-padding-end-md u-padding-bottom-lg">
                            <FormattedPrice value={price} />
                        </div>
                    </div>
                </Card>
            ))
        :
            <SkeletonBlock height="34px" />
        }
    </div>
)


OrderItems.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        price: PropTypes.string.isRequired,
        itemName: PropTypes.string,
        quantity: PropTypes.string
    }))
}

const mapStateToProps = createPropsSelector({
    items: getOrderItems
})

export default connect(
    mapStateToProps
)(OrderItems)
