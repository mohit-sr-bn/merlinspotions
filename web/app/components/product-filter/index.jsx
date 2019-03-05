/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import queryString from 'query-string'

import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {browserHistory} from 'progressive-web-sdk/dist/routing'

import {isRunningInAstro} from '../../containers/app/selectors'
import * as selectors from '../../containers/product-list/selectors'

import urlMapper from '../../config/url-mapper'

import {Accordion, AccordionItem} from 'progressive-web-sdk/dist/components/accordion'
import Button from 'progressive-web-sdk/dist/components/button'


const goToURL = (url, isRunningInAstro) => {
    if (url === window.location.href) { return }

    // Use a dom anchor as a parser.
    const anchor = document.createElement('a')
    anchor.href = url

    const historyEntry = {
        pathname: anchor.pathname,
        query: queryString.parse(anchor.search)
    }

    if (isRunningInAstro) {
        browserHistory.replace(historyEntry)
    } else {
        browserHistory.push(historyEntry)
    }
}


const ProductFilter = ({isRunningInAstro, productSearch, uiState}) => {

    const {filters = []} = productSearch || {}

    return (
        <Accordion
            className="c-product-filter"
            initialOpenItems={[0]}>
            {filters.map(({label, ruleset, kinds}) =>
                <AccordionItem header={label} key={ruleset} className="u-padding-0">
                    {/* disabling a11y lints–the handler below is
                    for the bubbled events from the children button elements */}
                    {/* eslint-disable
                        jsx-a11y/click-events-have-key-events,
                        jsx-a11y/onclick-has-focus,
                        jsx-a11y/onclick-has-role,
                        jsx-a11y/no-static-element-interactions
                    */}
                    <div className="c-product-filter__options" role="presentation">
                        {kinds
                            .filter(({count}) => (count > 0))
                            .map(({count, label, query, searchKey}) => {
                                const searchState = {
                                    ...uiState,
                                    start: 0,
                                    filters: {
                                        ...uiState.filters,
                                        [ruleset]: searchKey
                                    }
                                }

                                return (
                                    <Button
                                        key={query}
                                        className="c-product-filter__option pw--link"
                                        innerClassName="u-justify-start"
                                        id={query}
                                        onClick={() => goToURL(urlMapper.getSearchUrl(searchState), isRunningInAstro)}
                                        data-analytics-name={UI_NAME.showFilters}
                                    >
                                        <span className="u-color-brand u-margin-end-sm">{label}</span> <span className="u-color-neutral-40">({count})</span>
                                    </Button>
                                )
                            }
                        )}
                    </div>
                </AccordionItem>
            )}
        </Accordion>
    )
}

ProductFilter.propTypes = {
    isRunningInAstro: PropTypes.bool,
    productSearch: PropTypes.object,
    uiState: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    isRunningInAstro,
    productSearch: selectors.getProductSearch,
    uiState: selectors.getUIState,
})

export default connect(mapStateToProps)(ProductFilter)
