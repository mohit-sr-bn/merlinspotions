/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import {HeaderBar, HeaderBarActions, HeaderBarTitle} from 'progressive-web-sdk/dist/components/header-bar'
import IconLabelButton from '../../../components/icon-label-button'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const AddAddressHeader = ({closeAddressModal, title}) => (
    <HeaderBar>
        <HeaderBarTitle className="u-flex u-padding-start u-text-align-start">
            <h2 className="u-text-family-header u-text-uppercase">
                <span className="u-text-weight-extra-light">{title}</span>
            </h2>
        </HeaderBarTitle>

        <HeaderBarActions>
            <IconLabelButton iconName="close" label="close" onClick={closeAddressModal} analyticsName={UI_NAME.dismissModal}>Close</IconLabelButton>
        </HeaderBarActions>
    </HeaderBar>
)

AddAddressHeader.propTypes = {
    closeAddressModal: PropTypes.func,
    title: PropTypes.string
}

export default AddAddressHeader
