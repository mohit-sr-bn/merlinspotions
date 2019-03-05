/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import Button from 'progressive-web-sdk/dist/components/button'
import IconLabel from 'progressive-web-sdk/dist/components/icon-label'
import {HeaderBarActions} from 'progressive-web-sdk/dist/components/header-bar'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const MoreMenuAction = ({innerButtonClassName, onClick}) => (
    <HeaderBarActions className="t-header-bar__more">
        <div role="navigation">
            <Button
                id="more-menu"
                innerClassName={innerButtonClassName}
                onClick={onClick}
                data-analytics-name={UI_NAME.moreMenu}
            >
                <IconLabel label="More" iconName="more" iconSize="medium" />
            </Button>
        </div>
    </HeaderBarActions>
)

MoreMenuAction.propTypes = {
    innerButtonClassName: PropTypes.string,
    onClick: PropTypes.func
}

export default MoreMenuAction
