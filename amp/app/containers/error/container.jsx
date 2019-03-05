/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import {APP_ID} from '../app/constants'

import {HeaderBar, HeaderBarTitle} from 'mobify-amp-sdk/dist/components/header-bar'
import Img from 'mobify-amp-sdk/dist/components/img'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'
import Button from 'mobify-amp-sdk/dist/components/button'
import Footer from '../footer/container'

import {canonicalURL, staticURL} from '../../utils'

const ErrorContainer = ({children}) => (

    <body
        id={APP_ID}
        className="t-app t-error"
    >

        {children}

        <div id="app-wrap" className="t-app__wrapper u-flexbox u-direction-column">
            <div id="app-header" className="u-flex-none" role="banner">
                <header className="t-header">
                    <div className="t-header__bar">
                        <HeaderBar>
                            <HeaderBarTitle href={canonicalURL('/')}>
                                <Img src={staticURL('svg/logo.svg')} width="67" height="28" layout="fixed" />
                            </HeaderBarTitle>
                        </HeaderBar>
                    </div>
                </header>
            </div>

            <main id="app-main" className="u-flex" role="main">
                <div className="t-error-container u-padding-top-lg u-padding-start-sm u-padding-end-sm">
                    <h1 className="u-padding-top-lg u-padding-start-sm u-padding-bottom-lg">PAGE NOT FOUND</h1>

                    <div className="t-error-container-content u-text-align-center u-padding-top-lg u-padding-start-en u-padding-end-en">
                        <Img className="u-padding-top-lg" src={staticURL('img/global/no-results.png')} width="122px" height="110px" layout="fixed" />
                        <p className="u-text-size-base u-text-height-big u-padding-top-md u-padding-bottom-sm">
                            Oh, it looks like this link isn't working.
                        </p>
                        <Button
                            className="a--primary button u-width-full u-text-size-base u-margin-top-md"
                            href={canonicalURL('/')}
                        >
                            GO TO HOMEPAGE
                        </Button>
                    </div>

                </div>
            </main>

            <div id="app-footer" className="t-footer u-flex-none">
                <Footer />
            </div>
        </div>
    </body>
)

ErrorContainer.propTypes = {
    children: PropTypes.node
}

ErrorContainer.templateName = 'error'

export default ampComponent(ErrorContainer)
