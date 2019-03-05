/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import ListTile from 'progressive-web-sdk/dist/components/list-tile'
import NavItem from 'progressive-web-sdk/dist/components/nav-item'
import Icon from 'progressive-web-sdk/dist/components/icon'
import classNames from 'classnames'


/**
 * Icon used on project-specific nav items
 */
export const NavItemIcon = ({name}) => (
    <div className="c-nav-item__icon">
        <Icon className="c-nav-item__icon-content" name={name} />
    </div>
)

NavItemIcon.propTypes = {
    name: PropTypes.string,
}


/**
 * Project-specific NavItem which displays an icon on the left.
 */
export const NavItemWithIcon = (props) => (
    <NavItem {...props} className={`${props.className} pw--with-icon`} />
)

NavItemWithIcon.propTypes = NavItem.propTypes


/**
 * Project-specific NavItem with on-click handler and options for start
 * and end actions.
 */
export const NavItemWithOnClick = (props) => {
    const {title, options, content, className} = props

    const classes = classNames('c-nav-item', className)
    if (options || props.selected) {
        return (
            <ListTile {...props}
                className={classes}
                startAction={options.icon && <NavItemIcon name={options.icon} />}
                endAction={props.selected && <NavItemIcon name={'check'} />}
            >
                {content ? content : title}
            </ListTile>
        )
    } else {
        return (
            <ListTile {...props} className="c-nav-item">
                {content ? content : title}
            </ListTile>
        )
    }
}

NavItemWithOnClick.propTypes = NavItem.propTypes

/**
 * Project-specific NavItem which displays an account icon on the left.
 */
export const AccountNavItem = (props) => {
    const {options} = props
    const classes = options ? options.className : ''
    return (
        <NavItemWithIcon {...props}
            className={classes}
            beforeContent={<NavItemIcon name={options ? options.icon : null} />} />
    )
}

AccountNavItem.propTypes = NavItem.propTypes
