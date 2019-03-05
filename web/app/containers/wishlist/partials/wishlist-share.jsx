/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import Button from 'progressive-web-sdk/dist/components/button'
import {getWishlistShareURL} from 'progressive-web-sdk/dist/store/user/selectors'


const WishlistShareButton = ({
    shareURL
}) => (
    <div className="u-bg-color-neutral-10 u-border-light-bottom u-padding-top-md u-padding-bottom-md">
        <div className="u-border-light-top u-border-light-bottom u-bg-color-neutral-00">
            <Button
                title="Share Wish List"
                icon="share"
                showIconText={true}
                href={shareURL}
                className="u-color-brand u-text-letter-spacing-normal u-width-full"
            />
        </div>
    </div>
)


WishlistShareButton.propTypes = {
    shareURL: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    shareURL: getWishlistShareURL
})

export default connect(
    mapStateToProps
)(WishlistShareButton)
