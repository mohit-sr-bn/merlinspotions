/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'
import {APP_ID} from './constants'
import {NAV_SHEET} from '../../modals/constants'
import sprite from '../../static/svg/sprite-dist/sprite.svg'
import IM from 'mobify-integration-manager/dist/'

// Partials
import Header from '../header/container'
import Footer from '../footer/container'

// Components
import SkipLinks from 'mobify-amp-sdk/dist/components/skip-links'
import AmpNotification from 'mobify-amp-sdk/dist/components/user-notification'

import ModalManager from '../../modals'

const App = ({children}) => {

    const skipLinksItems = [
        // Customize your list of SkipLinks here. These are necessary to
        // achieve compliance with WCAG 2.0's guideline 2.4.1: "Bypass
        // Blocks". Compliance is required under some laws, such as the ADA
        // (Americans with Disabilities Act). For more details, see here:
        //
        // @URL: https://www.w3.org/TR/WCAG20-TECHS/G1.html
        {target: '#app-main', label: 'Skip to content'},
        {target: '#header-navigation', label: 'Skip to main navigation'},
        {target: '#app-footer', label: 'Skip to footer'},
    ]

    const notificationMessage = (
        <span>
            This site uses AMP client ID's to provide a richer shopping experience. Click
            <a href="https://www.merlinspotions.com/privacy-policy-cookie-restriction-mode/">&nbsp;here&nbsp;</a>
            to learn more.
        </span>
    )

    return (
        <body
            id={APP_ID}
            className="t-app"
        >
            <div hidden dangerouslySetInnerHTML={{__html: sprite}} />

            <ModalManager />

            <SkipLinks items={skipLinksItems} />

            <div id="app-wrap" className="t-app__wrapper u-flexbox u-direction-column">
                <div id="app-header" className="u-flex-none" role="banner">
                    <Header navId={NAV_SHEET} />
                </div>

                <main id="app-main" className="u-flex" role="main">
                    {children}
                </main>

                <div id="app-footer" className="u-flex-none">
                    <AmpNotification text={notificationMessage} buttonText="Got it!" />
                    <Footer />
                </div>
            </div>
        </body>
    )
}

App.propTypes = {
    children: PropTypes.node
}

App.resolves = [({dispatch}) => {
    return dispatch(IM.app.initApp())
}]

export default ampComponent(App)
