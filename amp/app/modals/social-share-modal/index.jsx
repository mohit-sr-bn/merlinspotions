/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'

// Components
import Button from 'mobify-amp-sdk/dist/components/button'
import SocialShare from 'mobify-amp-sdk/dist/components/social-share'
import Lightbox from 'mobify-amp-sdk/dist/components/lightbox'
import {HeaderBar, HeaderBarTitle, HeaderBarActions} from 'mobify-amp-sdk/dist/components/header-bar'

const SocialShareModal = ({
    id
}) => (
    <Lightbox id={id}>
        <div className="m-social-share-modal__overlay">
            <HeaderBar className="m-social-share-modal__header u-border-bottom u-padding-0">
                <HeaderBarTitle className="m-social-share-modal__header-title u-text-family-header u-padding-lg u-h4">Share via</HeaderBarTitle>

                <HeaderBarActions>
                    <Button
                        className="pw--secondary"
                        icon="close"
                        title="Close"
                        on={`tap:${id}.close`}
                    />
                </HeaderBarActions>
            </HeaderBar>

            <div className="u-padding-lg">
                <SocialShare
                    className="u-flexbox u-justify-around"
                    options={[
                        {type: 'email', text: 'Email'},
                        {type: 'sms', text: 'SMS'},
                        {type: 'facebook', text: 'Facebook'},
                        {type: 'twitter', text: 'Twitter'}
                    ]}
                />
            </div>
        </div>
    </Lightbox>
)

SocialShareModal.propTypes = {
    id: PropTypes.string
}

export default ampComponent(SocialShareModal)
