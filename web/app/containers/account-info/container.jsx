/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ReduxForm from 'redux-form'
import {createPropsSelector} from 'reselect-immutable-helpers'

import template from '../../template'
import PageMeta from '../../components/page-meta'

import {getAccountURL} from '../app/selectors'

import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'
import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import PasswordInput from 'progressive-web-sdk/dist/components/password-input'
import Button from 'progressive-web-sdk/dist/components/button'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {initialize, submitAccountInfoForm} from './actions'
import {
    getAccountInfoPageMeta,
    getAccountInfoInitialValues
} from './selectors'

const AccountInfoForm = ({
    handleSubmit,
    onSubmit,
    dashboardURL,
    pageMeta
}) => {
    return (
        <div className="t-account-info">
            <PageMeta {...pageMeta} />

            <div className="t-account-info__headings u-padding-top-lg u-padding-bottom-lg u-padding-start-md u-padding-end-md">
                <div className="t-account-info__breadcrumb">
                    <Breadcrumbs items={[{text: 'Back to Dashboard', href: dashboardURL}]} />
                </div>
                <div className="u-margin-top-md">
                    <h1 className="t-account-info__title u-text-uppercase u-width-1of2">Edit Account</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="t-account-info__sub-heading">
                    <h2 className="u-h5 u-text-family">Change name / email</h2>
                </div>
                <div className="t-account-info__content u-padding-md">
                    <FieldRow>
                        <ReduxForm.Field
                            component={Field}
                            label="First & Last Name"
                            name="names"
                        >
                            <input
                                className="t-account-info-input"
                                type="text"
                                data-analytics-name={UI_NAME.customerName}
                            />
                        </ReduxForm.Field>
                    </FieldRow>
                    <FieldRow>
                        <ReduxForm.Field
                            component={Field}
                            label="Email"
                            name="email"
                        >
                            <input
                                className="t-account-info-input"
                                type="text"
                                data-analytics-name={UI_NAME.email}
                            />
                        </ReduxForm.Field>
                    </FieldRow>
                </div>
                <div className="t-account-info__sub-heading">
                    <h2 className="u-h5 u-text-family">Change password (optional)</h2>
                </div>
                <div className="t-account-info__content u-padding-md">
                    <FieldRow>
                        <ReduxForm.Field
                            component={Field}
                            label="Current Password"
                            name="currentPassword"
                        >
                            <PasswordInput isText buttonTextHide="hide" buttonTextShow="show" analyticsName={UI_NAME.currentPassword} />
                        </ReduxForm.Field>
                    </FieldRow>
                    <FieldRow>
                        <ReduxForm.Field
                            component={Field}
                            label="New Password"
                            name="newPassword"
                        >
                            <PasswordInput isText buttonTextHide="hide" buttonTextShow="show" analyticsName={UI_NAME.password} />
                        </ReduxForm.Field>
                    </FieldRow>
                    <FieldRow>
                        <Button
                            type="submit"
                            className="pw--primary u-width-full"
                        >
                        Save
                        </Button>
                    </FieldRow>
                </div>
            </form>
        </div>
    )
}

AccountInfoForm.propTypes = {
    dashboardURL: PropTypes.string,
    handleSubmit: PropTypes.func,
    pageMeta: PropTypes.object,
    onSubmit: PropTypes.func,
}

const mapStateToProps = createPropsSelector({
    dashboardURL: getAccountURL,
    initialValues: getAccountInfoInitialValues,
    pageMeta: getAccountInfoPageMeta
})

const mapDispatchToProps = {
    onSubmit: submitAccountInfoForm
}

const AccountInfo = ReduxForm.reduxForm({
    form: 'accountInfo'
})(AccountInfoForm)

AccountInfo.initAction = initialize

export default template(connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountInfo))
