/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

// Magento Filter Label component only work with Merlins connector because they are
// parsing the filter data differntly than any other connectors.

import React from 'react'
import PropTypes from 'prop-types'
import {FormattedPrice} from '../intl/index'

const MagentoFilterLabel = ({
    label
}) => {
    let output = label.trim()

    // if output is not number then output as it is
    if (isNaN(parseInt(output))) {
        output = label

        return (
            <span>{output}</span>
        )
    } else {
        // Match number
        const outputMatchNumber = output.match(/([\d.]+)/g)

        // Output first number
        let first = outputMatchNumber[0]

        // Output second number
        const second = outputMatchNumber[1]

        // check if string return "and above"
        let isAboveString

        if (/[a-zA-Z_ ]+/g.test(output.match(/[a-zA-Z_ ]+/g)[0].trim())) {
            isAboveString = true
        }

        // Check if it only output number
        if (/^\d+$/.test(output)) {
            first = output
        }

        // Check to ouput second part if it's string or number
        let outputSecond

        if (isAboveString) {
            // Check if output include alphabet string
            outputSecond = output.match(/[a-zA-Z_ ]+/g)[0].trim()
        } else {
            outputSecond = ['- ', <FormattedPrice key={0} value={second} />]
        }

        return (
            <span>
                <FormattedPrice key={0} value={first} /> {outputSecond}
            </span>
        )
    }
}

MagentoFilterLabel.propTypes = {
    /**
     * A function used to set the filter sheet's state to closed
     */
    label: PropTypes.string
}

export default MagentoFilterLabel
