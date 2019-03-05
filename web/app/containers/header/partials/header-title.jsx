/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import DangerousHTML from 'progressive-web-sdk/dist/components/dangerous-html'
import Link from 'progressive-web-sdk/dist/components/link'
import {HeaderBarTitle} from 'progressive-web-sdk/dist/components/header-bar'
import {getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'

import logo from '../../../static/svg/logo.svg'

import {VIEWPORT_SIZE_NAMES} from 'progressive-web-sdk/dist/ssr/constants'

const HeaderTitle = ({isCollapsed, viewportSize}) => {
    const classes = classNames('t-header-bar__title', {
        'u-padding-start-lg': viewportSize === VIEWPORT_SIZE_NAMES.LARGE || viewportSize === VIEWPORT_SIZE_NAMES.XLARGE
    })
    const linkClassName = classNames('t-header__link', {
        't--fade-sparkles': isCollapsed
    })

    return (
        <div className={classes}>
            <HeaderBarTitle>
                <Link href="/" className={linkClassName}>
                    <DangerousHTML html={logo}>
                        {(htmlObj) => <div className="t-header__logo" dangerouslySetInnerHTML={htmlObj} />}
                    </DangerousHTML>
                    <h1 className="u-visually-hidden">mobify_platform_test</h1>
                </Link>
            </HeaderBarTitle>
        </div>
    )
}

HeaderTitle.propTypes = {
    isCollapsed: PropTypes.bool,
    viewportSize: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    viewportSize: getviewportSize
})

export default connect(mapStateToProps)(HeaderTitle)
