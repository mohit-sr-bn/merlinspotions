/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {reorderItem} from '../actions'

import Button from 'progressive-web-sdk/dist/components/button'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const ReorderButton = ({onReorderClick}) => (
    <div className="u-padding-md">
        <Button
            icon="cart"
            onClick={onReorderClick}
            iconClassName="u-margin-end"
            title="Reorder"
            showIconText={true}
            className="pw--primary u-width-full"
            data-analytics-name={UI_NAME.reorder}
        />
    </div>
)


ReorderButton.propTypes = {
    onReorderClick: PropTypes.func
}

const mapStateToProps = createPropsSelector({
})


const mapDispatchToProps = {
    onReorderClick: reorderItem
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReorderButton)
