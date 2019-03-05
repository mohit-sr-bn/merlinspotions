/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'

import Button from 'progressive-web-sdk/dist/components/button'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const PrintButton = () => (
    <div className="u-padding-start-md u-padding-end-md">
        <Button
            onClick={() => window.print()}
            iconClassName="u-margin-end"
            text="Print"
            className="pw--tertiary u-width-full"
            data-analytics-name={UI_NAME.print}
        />
    </div>
)

export default PrintButton
