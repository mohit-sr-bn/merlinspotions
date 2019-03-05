/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import addToHomescreen from 'progressive-web-sdk/dist/components/add-to-homescreen'
import {NavItemWithOnClick} from '../nav-item'


/**
 * This component provides the user with UI to install the PWA to their phone's
 * home screen. It will only render on browsers that support "Add To Home
 * Screen" functionality (i.e. Chrome 68 and above).
 */

const InstallAppButton = (props) => {
    const {prompt, status} = props
    const classes = classNames('c-install-app-button')

    switch (status) {
        case addToHomescreen.UNSUPPORTED:
        case addToHomescreen.HIDDEN:
            return ''
        case addToHomescreen.ACTIVE:
            return (
                <div className={classes}>
                    <NavItemWithOnClick
                        {...props}
                        onClick={() => prompt()}
                    />
                </div>
            )
        case addToHomescreen.INACTIVE:
            return (
                <div className={classes}>
                    <NavItemWithOnClick
                        {...props}
                        className="u-color-neutral-30 u-bg-color-neutral-10"
                        title="Refresh and try installing again"
                    />
                </div>
            )
    }

    return ''
}


InstallAppButton.propTypes = {
    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    /**
     * This function will trigger the "Add To Home Screen" prompt
     */
    prompt: PropTypes.func,

    /**
     * Displays the current status of the addToHomescreen component. Can be
     * HIDDEN, ACTIVE, INACTIVE or UNSUPPORTED. These constants are available on
     * the `addToHomescreen` higher order component (i.e. `addToHomescreen.ACTIVE`)
     */
    status: PropTypes.string,
}

export default addToHomescreen(InstallAppButton)
