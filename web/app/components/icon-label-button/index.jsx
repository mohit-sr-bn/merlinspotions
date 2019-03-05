/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from 'progressive-web-sdk/dist/components/button'
import IconLabel from 'progressive-web-sdk/dist/components/icon-label'

const IconLabelButton = (props) => {
    const {analyticsName, iconName, label, onClick, className} = props
    const classes = classNames('c-icon-label-button', className)

    return (
        <Button
            onClick={onClick}
            className={classes}
            innerClassName="u-padding-0"
            data-analytics-name={analyticsName}
        >
            <IconLabel label={label} iconName={iconName} />
        </Button>
    )
}

IconLabelButton.propTypes = {
    analyticsName: PropTypes.string,
    className: PropTypes.string,
    iconName: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
}


export default IconLabelButton
