/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'
import {getProductDescription} from 'progressive-web-sdk/dist/store/products/selectors'
import {Accordion, AccordionItem} from 'progressive-web-sdk/dist/components/accordion'
import DangerousHTML from 'progressive-web-sdk/dist/components/dangerous-html'

const ProductDetailsMoreInfo = ({description, viewportSize}) => {

    const hasContent = description && !!description.length
    const mediumAndSmaller = (viewportSize === 'small' || viewportSize === 'medium')

    return (
        <div className="t-product-details__more-info">
            {(hasContent && mediumAndSmaller) ? (
                <Accordion className=" u-bg-color-neutral-00" initialOpenItems={['0']}>
                    <AccordionItem header="Product Description" closeIconName="close" openIconName="plus">
                        <DangerousHTML html={description}>
                            {(htmlObj) => <div itemProp="description" dangerouslySetInnerHTML={htmlObj} />}
                        </DangerousHTML>
                    </AccordionItem>
                </Accordion>
            ) : (
                <div className="u-border-top u-padding-top-md u-margin-bottom-md">
                    <h5 className="u-margin-bottom">Product Description</h5>
                    <DangerousHTML html={description}>
                        {(htmlObj) => <div itemProp="description" dangerouslySetInnerHTML={htmlObj} />}
                    </DangerousHTML>
                </div>
            )}
        </div>
    )
}

ProductDetailsMoreInfo.propTypes = {
    description: PropTypes.string,
    viewportSize: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    description: getProductDescription,
    viewportSize: getviewportSize
})

export default connect(mapStateToProps)(ProductDetailsMoreInfo)
