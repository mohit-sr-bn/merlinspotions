/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {withRouter} from 'progressive-web-sdk/dist/routing'

import template from '../../template'
import PageMeta from '../../components/page-meta'

import {getPageMeta} from './selectors'
import SignInPanel from './partials/signin-panel'
import RegisterPanel from './partials/register-panel'

import {Tabs, TabsPanel} from 'progressive-web-sdk/dist/components/tabs'
import {initialize} from './actions'

import {
    SIGN_IN_SECTION,
    REGISTER_SECTION,
    SECTION_NAMES,
    INDEX_FOR_SECTION,
    SECTION_FOR_INDEX
} from './constants'

import {isRunningInAstro} from '../app/selectors'

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeTab = this.onChangeTab.bind(this)
    }

    onChangeTab(index) {
        this.props.navigateToSection(
            this.props.router,
            this.props.routes,
            SECTION_FOR_INDEX[index]
        )
    }

    render() {
        const {
            route: {
                routeName
            },
            pageMeta,
            isRunningInAstro
        } = this.props

        if (!isRunningInAstro) {
            return (
                <div className="t-login">
                    <PageMeta {...pageMeta} />

                    <div className="u-bg-color-neutral-10 u-padding-md u-padding-top-lg u-padding-bottom-lg u-box-shadow-inset">
                        <h1 className="u-text-uppercase u-text-weight-medium">
                            Customer Login
                        </h1>
                    </div>

                    <Tabs activeIndex={INDEX_FOR_SECTION[routeName]} className="t-login__navigation" onChange={this.onChangeTab}>
                        <TabsPanel title={SECTION_NAMES[SIGN_IN_SECTION]}>
                            <SignInPanel />
                        </TabsPanel>
                        <TabsPanel title={SECTION_NAMES[REGISTER_SECTION]}>
                            <RegisterPanel />
                        </TabsPanel>
                    </Tabs>
                </div>
            )
        } else if (routeName === SIGN_IN_SECTION) {
            return (
                <div className="t-login">
                    <SignInPanel />
                </div>
            )
        } else if (routeName === REGISTER_SECTION) {
            return (
                <div className="t-login">
                    <RegisterPanel />
                </div>
            )
        } else {
            console.log('route unsupported: ', routeName)
            return null
        }
    }
}

const mapStateToProps = createPropsSelector({
    pageMeta: getPageMeta,
    isRunningInAstro
})

const mapDispatchToProps = {
    navigateToSection: IntegrationManager.account.navigateToSection
}

Login.propTypes = {
    isRunningInAstro: PropTypes.bool,
    navigateToSection: PropTypes.func,
    pageMeta: PropTypes.object,
    route: PropTypes.object,
    router: PropTypes.object,
    routes: PropTypes.array
}

Login.initAction = initialize

export default template(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withRouter(Login))
)
