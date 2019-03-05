/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'

// Components
import Img from 'mobify-amp-sdk/dist/components/img'

// Utils
import {staticURL} from '../../../utils'

// Social Icons
const social = [
    ['http://www.facebook.com/#TODO', staticURL('svg/facebook.svg'), 'Facebook'],
    ['http://www.twitter.com/#TODO', staticURL('svg/twitter.svg'), 'Twitter'],
    ['http://plus.google.com/#TODO', staticURL('svg/googleplus.svg'), 'Google+'],
    ['http://www.youtube.com/#TODO', staticURL('svg/youtube.svg'), 'Youtube'],
]

const NavigationSocialIcons = () => {
    return (
        <div className="m-navigation__social">
            <div className="u-flexbox u-justify-center">
                {social.map(([url, icon, title]) =>
                    <a href={url} className="m-navigation__social-link" key={url}>
                        <Img
                            src={icon}
                            alt={title}
                            height="32"
                            width="32"
                            layout="fixed"
                        />
                    </a>
                )}
            </div>
        </div>
    )
}

export default NavigationSocialIcons
