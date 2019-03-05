/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {isRunningInAstro} from '../app/selectors'
import {getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'

import FooterExtras from './partials/footer-extras'
import FooterNavigation from './partials/footer-navigation'

const Footer = ({isRunningInAstro, viewportSize}) => {
    if (isRunningInAstro) {
        return null
    }

    return (
        <footer className="t-footer">
            <FooterNavigation viewportSize={viewportSize} />
            <FooterExtras viewportSize={viewportSize} />
            <p className="qa-footer__copyright">&copy; 2018 Mobify Research & Development Inc.</p>
        </footer>
    )
}

Footer.propTypes = {
    isRunningInAstro: PropTypes.bool,
    viewportSize: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    isRunningInAstro,
    /**
    * Provides a string description of the current viewport size
    */
    viewportSize: getviewportSize
})

export default connect(mapStateToProps)(Footer)
