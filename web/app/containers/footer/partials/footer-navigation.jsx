/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import React from 'react'
import PropTypes from 'prop-types'

import Link from 'progressive-web-sdk/dist/components/link'


const getFooterLinks = function(viewportSize) {

    if (viewportSize === 'small' || viewportSize === 'medium') {
        return [
            {text: 'Privacy and Cookie Policy', href: '/privacy-policy-cookie-restriction-mode/'},
            {text: 'Orders and Returns', href: '/sales/guest/form/'},
        ]
    } else {
        return [
            {
                heading: 'Customer Service',
                contents: [
                    {text: 'Shipping info', href: '/sales/guest/form/'},
                    {text: 'Returns policy', href: '/sales/guest/form/'},
                    {text: 'Track Orders', href: '/sales/guest/form/'},
                    {text: 'Contact us', href: '/sales/guest/form/'},
                ]
            },
            {
                heading: 'Privacy',
                contents: [
                    {text: 'My subscriptions', href: '/'},
                    {text: 'Terms & Conditions', href: '/'},
                    {text: 'Privacy & Cookies', href: '/'},
                    {text: 'Legal disclaimer', href: '/'},
                ]
            },
            {
                heading: 'About Us',
                contents: [
                    {text: 'Stores', href: '/'},
                    {text: 'Careers', href: '/'},
                    {text: 'Media & Press', href: '/'},
                    {text: 'Site map', href: '/'},
                ]
            },
            {
                heading: 'More from Merlins',
                contents: [
                    {text: 'Rewards Program', href: '/'},
                    {text: 'Merlin\'s Club', href: '/'},
                    {text: 'Blog', href: '/'},
                    {text: 'Gift Cards', href: '/'},
                ]
            }
        ]
    }
}


const FooterNavigation = ({viewportSize}) => {
    const footerLinks = getFooterLinks(viewportSize)

    return (
        <div className="t-footer__navigation">
            {footerLinks && (viewportSize === 'small' || viewportSize === 'medium') &&
                footerLinks.map(({text, href}, index) => (
                    <Link className="t-footer__navigation-link" href={href} key={index}>
                        {text}
                    </Link>
                ))
            }
            {(footerLinks && (viewportSize === 'large' || viewportSize === 'xlarge')) &&
                footerLinks.map((obj, index) => (
                    <div className="t-footer__navigation-section" key={index}>
                        <h1 className="t-footer__navigation-header">{obj.heading}</h1>
                        {obj.contents.map(({text, href}, index) =>
                            <Link className="t-footer__navigation-link" href={href} key={index}>
                                {text}
                            </Link>
                        )}
                    </div>
                ))
            }
        </div>
    )
}

FooterNavigation.propTypes = {
    /**
    * Provides a string description of the current viewport size
    */
    viewportSize: PropTypes.string
}

export default FooterNavigation
