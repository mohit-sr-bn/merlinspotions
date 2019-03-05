/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import Button from 'progressive-web-sdk/dist/components/button'
import IconLabel from 'progressive-web-sdk/dist/components/icon-label'
import {HeaderBarActions} from 'progressive-web-sdk/dist/components/header-bar'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const SearchAction = ({innerButtonClassName, onClick}) => (
    <HeaderBarActions className="t-header-bar__search">
        <Button
            innerClassName={innerButtonClassName}
            onClick={onClick}
            data-analytics-name={UI_NAME.showSearchBar}
        >
            <IconLabel label="Search...." iconName="search..." iconSize="medium" />
        </Button>
    </HeaderBarActions>
)

SearchAction.propTypes = {
    innerButtonClassName: PropTypes.string,
    onClick: PropTypes.func
}

export default SearchAction
