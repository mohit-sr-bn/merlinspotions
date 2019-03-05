/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'

/**
 * Card component is used to show content in a card with header and footer
 */

const Card = ({
    className,
    header,
    children,
    footer,
    hasShadow,
    hasBorder,
    itemScope,
    itemType
}) => {
    const classes = classNames('c-card', {
        'c--shadow': hasShadow,
        'c--border': hasBorder,
    }, className)

    return (
        <article className={classes} itemScope={itemScope} itemType={itemType}>
            <div className="c-card__inner">
                {header &&
                    <header className="c-card__header">
                        {header}
                    </header>
                }
                <div className="c-card__content">
                    {children}
                </div>

                {footer &&
                    <footer className="c-card__footer">
                        {footer}
                    </footer>
                }
            </div>
        </article>
    )
}


Card.propTypes = {
    /**
     * Main content of the card
     */
    children: PropTypes.node,

    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    /**
     * Footer content of the card
     */
    footer: PropTypes.node,

    /**
     * Determines if card has border
     */
    hasBorder: PropTypes.bool,

    /**
     * Determines if card has box-shadow
     */
    hasShadow: PropTypes.bool,

    /**
     * Header content of the card
     */
    header: PropTypes.node,

    /**
     * A value for the itemScope attribute
     * used to provide microdata to a page for SEO
     * https://www.w3.org/TR/microdata/
     */
    itemScope: PropTypes.bool,

    /**
     * A value for the itemType attribute
     * used to provide microdata to a page for SEO
     * https://www.w3.org/TR/microdata/
    */
    itemType: PropTypes.string
}

export default ampComponent(Card)
