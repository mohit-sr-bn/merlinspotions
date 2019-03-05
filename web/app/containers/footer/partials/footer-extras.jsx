/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Link from 'progressive-web-sdk/dist/components/link'


const FooterExtras = ({viewportSize}) => {

    return (
        <div className="t-footer__extras">
            <Button className="t-footer__locale">
                <Icon name="flag-ca" size="medium" className="u-margin-end-md" title="Canada" />
                Canada (English)
            </Button>

            {(viewportSize === 'large' || viewportSize === 'xlarge') &&
                <div className="t-footer__social">
                    {/* TODO: Compare these social links with those in the navigation when implementing responsive header. If they are similar enough, move to a shared component. */}
                    <Link href="/" className="t-footer__social-link">
                        <Icon name="social-facebook" size="medium" className="t-footer__social-icon" title="Facebook" />
                    </Link>
                    <Link href="/" className="t-footer__social-link">
                        <Icon name="social-twitter" size="medium" className="t-footer__social-icon" title="Twitter" />
                    </Link>
                </div>
            }
        </div>
    )
}

FooterExtras.propTypes = {
    /**
    * Provides a string description of the current viewport size
    */
    viewportSize: PropTypes.string
}

export default FooterExtras
