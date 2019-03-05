/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {canonicalURL} from '../../../utils'

// Components
import Icon from 'mobify-amp-sdk/dist/components/icon'
import Link from 'mobify-amp-sdk/dist/components/link'

// Partials
import NewsletterForm from './newsletter-form'

const FooterNewsletterSubscription = ({onSubmit}) => {
    return (
        <div className="t-footer__newsletter u-padding-md u-padding-top-lg u-padding-bottom-lg">
            <div>
                <div className="u-margin-bottom-md u-padding-start-md u-padding-end-md u-flexbox u-align-center">
                    <Icon name="alert" title="Subscribe to Notifications" className="u-flex-none" />
                    <h2 className="u-h4 u-padding-start-md">
                        Subscribe to Merlins
                    </h2>
                </div>

                <p className="u-margin-bottom-md">Monthly email with news, top potion-making tips and promotions.</p>

                <NewsletterForm onSubmit={onSubmit} />

                <p className="u-margin-top-md u-text-weight-thin u-color-neutral-50">
                    We don't share your email address with any third parties and you can opt out at any time.
                    Find out more in our <Link href={canonicalURL('/privacy-policy-cookie-restriction-mode')}>Privacy policy</Link>
                </p>
            </div>
        </div>
    )
}

FooterNewsletterSubscription.propTypes = {
    onSubmit: PropTypes.func
}

export default FooterNewsletterSubscription
