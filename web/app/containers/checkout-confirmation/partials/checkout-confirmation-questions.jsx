/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {GRID_SETTINGS} from '../constants'

import Button from 'progressive-web-sdk/dist/components/button'
import {Grid, GridSpan} from 'progressive-web-sdk/dist/components/grid'
import Icon from 'progressive-web-sdk/dist/components/icon'
import List from 'progressive-web-sdk/dist/components/list'
import ListTile from 'progressive-web-sdk/dist/components/list-tile'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {continueShopping} from '../actions'

/* eslint-disable react/prop-types */
const QuestionLink = ({children, href}) => (
    <ListTile
        href={href}
        endAction={<Icon name="chevron-right" className="u-flex-none" />}
    >
        <div className="u-flexbox">
            <div className="u-flex">{children}</div>
        </div>
    </ListTile>
)
/* eslint-enable react/prop-types */

const CheckoutConfirmationQuestions = ({continueShopping}) => (
    <Grid className="t-checkout-confirmation__questions u-center-piece">
        <GridSpan {...GRID_SETTINGS}>
            <div className="t-checkout-confirmation__heading u-padding-md u-padding-top-lg">
                <h2 className="u-h4 u-text-uppercase">Any Questions</h2>
            </div>
        </GridSpan>

        <GridSpan {...GRID_SETTINGS}>
            <div className="t-checkout-confirmation__card u-bg-color-neutral-00 u-border-light-top u-border-light-bottom">
                <List>
                    <QuestionLink href="/sales/order/history/">Orders and Returns</QuestionLink>
                    <QuestionLink href="/contact/">Contact Us</QuestionLink>
                </List>
            </div>
        </GridSpan>

        <GridSpan {...GRID_SETTINGS}>
            <div className="u-padding-lg">
                <Button
                    onClick={continueShopping}
                    className="pw--tertiary u-width-full u-text-uppercase"
                    data-analytics-name={UI_NAME.continueShopping}
                >
                    Continue Shopping
                </Button>
            </div>
        </GridSpan>
    </Grid>
)

CheckoutConfirmationQuestions.propTypes = {
    continueShopping: PropTypes.func
}

const mapDispatchToProps = {
    continueShopping
}

export default connect(
    null,
    mapDispatchToProps
)(CheckoutConfirmationQuestions)
