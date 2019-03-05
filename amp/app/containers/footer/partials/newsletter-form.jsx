/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

// Components
import Button from 'mobify-amp-sdk/dist/components/button'
import Form from 'mobify-amp-sdk/dist/components/form'
import Field from 'mobify-amp-sdk/dist/components/field'
import FieldRow from 'mobify-amp-sdk/dist/components/field-row'

const NewsletterForm = ({disabled, submitting}) => {
    return (
        <Form method="POST" action-xhr="https://www.merlinspotions.com/newsletter/subscriber/new/" target="_top">
            <FieldRow>
                <Field>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        name="email"
                    />
                </Field>

                <Button
                    type="submit"
                    className="a--tertiary u-margin-0 u-text-uppercase"
                    disabled={submitting || disabled}>
                    Submit
                </Button>
            </FieldRow>
        </Form>
    )
}

NewsletterForm.propTypes = {
    /**
     * Whether the form is disabled or not
     */
    disabled: PropTypes.bool,
    /**
     * Redux-form internal
     */
    handleSubmit: PropTypes.func,
    /**
     * Redux-form internal
     */
    submitting: PropTypes.bool
}

export default NewsletterForm
