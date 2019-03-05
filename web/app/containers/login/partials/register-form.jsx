/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {Field as ReduxFormField, reduxForm} from 'redux-form'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {isRegisterLoaded} from '../selectors'
import {submitRegisterForm} from '../actions'

import Button from 'progressive-web-sdk/dist/components/button'
import Field from 'progressive-web-sdk/dist/components/field'
import FieldSet from 'progressive-web-sdk/dist/components/field-set'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Link from 'progressive-web-sdk/dist/components/link'

import {LoginField} from './common'
import ExtraField from '../../../components/extra-field'

import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {REGISTER_FORM_NAME} from '../../../store/form/constants'

import {
    getRegisterUserEnhancementInitialValues,
    getRegisterUserEnhancementFields
} from 'mobify-integration-manager/dist/connectors/hybris/selectors'

class RegisterForm extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
        this.toggleWhatIsInThese = this.toggleWhatIsInThese.bind(this)

        this.state = {
            whatIsInThese: true
        }
    }

    onSubmit(values) {
        return this.props.submitForm(values)
    }

    toggleWhatIsInThese() {
        const currentState = this.state.whatIsInThese

        this.setState({
            whatIsInThese: !currentState
        })
    }

    render() {
        const {
            error,
            submitting,
            handleSubmit,
            isFormLoaded,
            extraFields
        } = this.props

        const subscribeName = 'subscribe-newsletter'
        const subscribeYes = 'yes-subscribe'
        const subscribeNo = 'no-subscribe'
        const tabIndexWhatIsThese = this.state.whatIsInThese ? '-1' : '0'

        const whatsInTheseClasses = classNames('u-color-neutral-50', {
            'u-visually-hidden': this.state.whatIsInThese
        })

        const LabelButton = ({
            data,
            id,
            input,
            text,
            type
        }) => (
            <div className="t-login__subscribe-radio-button u-flex">
                <input
                    {...input}
                    type={type}
                    id={id}
                    data-analytics-name={data}
                />

                <label
                    className="u-width-full u-display-inline-table"
                    htmlFor={id}
                >
                    <div className="u-flexbox u-justify-center u-align-center">
                        <Icon className="u-margin-end" name="done" title="Check" />

                        {text}
                    </div>
                </label>
            </div>
        )

        return (
            <form id={REGISTER_FORM_NAME} data-analytics-name={UI_NAME.register} noValidate={true} onSubmit={handleSubmit(this.onSubmit)}>
                {error &&
                    <div className="u-margin-bottom-md u-color-error">
                        {error}
                    </div>
                }

                <FieldSet className="t-login__register-fieldset">
                    <ExtraField name="titleCode" extraFields={extraFields} />

                    <LoginField
                        label="First Name"
                        name="firstname"
                        type="text"
                        analyticsName={UI_NAME.firstName}
                        />

                    <LoginField
                        label="Last Name"
                        name="lastname"
                        type="text"
                        analyticsName={UI_NAME.lastName}
                        />

                    <LoginField
                        label="Email"
                        name="email"
                        type="email"
                        analyticsName={UI_NAME.email}
                    />

                    <div className="u-margin-top-lg">
                        <Field label={<span className="u-text-weight-regular">Want to receive email updates?</span>} />

                        <FieldRow>
                            <ReduxFormField
                                component={LabelButton}
                                data="receive_email_updates:yes"
                                id={subscribeYes}
                                name={subscribeName}
                                type="radio"
                                text="Yes please"
                                value={subscribeYes}
                            />

                            <ReduxFormField
                                component={LabelButton}
                                data="receive_email_updates:no"
                                id={subscribeNo}
                                name={subscribeName}
                                type="radio"
                                text="No, Thanks"
                                value={subscribeNo}
                            />
                        </FieldRow>

                        <Button
                            className="u-color-brand"
                            innerClassName="pw--no-min-width u-padding-start-0 u-padding-bottom-0"
                            onClick={this.toggleWhatIsInThese}
                        >
                            What's in these?
                            <Icon
                                className="u-margin-start-sm"
                                name={this.state.whatIsInThese ? 'chevron-down' : 'chevron-up'}
                            />
                        </Button>

                        <div
                            className={whatsInTheseClasses}
                            tabIndex={tabIndexWhatIsThese}
                        >
                            We send out a monthly email featuring news, top tips, and promotions. We don’t share your information and you can opt out any time.
                            Find out more in our <Link className="u-color-brand" href="/privacy-policy-cookie-restriction-mode/" tabIndex={tabIndexWhatIsThese}>Privacy policy</Link>
                        </div>
                    </div>
                </FieldSet>

                <FieldSet className="t-login__register-fieldset">
                    <LoginField
                        label="Password"
                        name="password"
                        type="password"
                        analyticsName={UI_NAME.password}
                        isPassword
                        />

                    <LoginField
                        label="Confirm Password"
                        name="password_confirmation"
                        type="password"
                        analyticsName={UI_NAME.confirmPassword}
                        isPassword
                        />
                </FieldSet>

                <FieldSet>
                    <p className="u-margin-top-md u-margin-bottom-lg u-color-neutral-50">
                        Your personal data will only be used to store an account on our site. We do not share with any third parties.
                    </p>

                    <LoginField
                        label={<span className="u-text-size-medium">I agree to <Link href="/privacy-policy-cookie-restriction-mode/">terms & conditions</Link></span>}
                        name="terms_and_conditions"
                        type="checkbox"
                        analyticsName="terms_and_conditions"
                    />
                </FieldSet>

                <Button
                    className="pw--primary u-width-full u-margin-top-lg"
                    type="submit"
                    disabled={submitting || !isFormLoaded}
                    data-analytics-name={UI_NAME.register}
                >
                    <span className="u-text-uppercase">Create an Account</span>
                </Button>
            </form>
        )
    }
}

RegisterForm.propTypes = {
    error: PropTypes.string,
    extraFields: ExtraField.propTypes.extraFields, // Just piggy back on the existing definition
    handleSubmit: PropTypes.func,
    isFormLoaded: PropTypes.bool,
    submitForm: PropTypes.func,
    submitting: PropTypes.bool,
}


const ReduxRegisterForm = reduxForm({
    form: REGISTER_FORM_NAME
})(RegisterForm)

const mapStateToProps = createPropsSelector({
    initialValues: getRegisterUserEnhancementInitialValues,
    isFormLoaded: isRegisterLoaded,
    extraFields: getRegisterUserEnhancementFields
})

const mapDispatchToProps = {
    submitForm: submitRegisterForm
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxRegisterForm)
