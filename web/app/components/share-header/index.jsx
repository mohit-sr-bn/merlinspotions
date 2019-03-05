/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

/**
 * This component is used by Share component as it's header content
 */

const ShareHeader = (dismissShareModal) => {
    const classes = 'c-share-header u-flex-none u-border-bottom'

    return (
        <div className={classes}>
            <div className="u-flexbox u-align-center">
                <h1 className="c-share-header__title u-flex u-padding-lg u-h4">
                    Share via
                </h1>

                <div className="u-flexbox u-flex-none u-align-center u-justify-center">
                    <Button
                        className="c-share-header__button u-text-uppercase"
                        onClick={() => dismissShareModal()}
                        data-analytics-name={UI_NAME.dismissModal}
                    >
                        <Icon name="close" title="Close" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ShareHeader
