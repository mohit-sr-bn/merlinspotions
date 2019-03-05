/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'

// Components
import Button from 'mobify-amp-sdk/dist/components/button'
import Sheet from 'mobify-amp-sdk/dist/components/sheet'
import {HeaderBar, HeaderBarActions, HeaderBarTitle} from 'mobify-amp-sdk/dist/components/header-bar'
import {Accordion, AccordionItem} from 'mobify-amp-sdk/dist/components/accordion'
import IconLabelButton from '../../components/icon-label-button'

// Selectors
import * as selectors from 'web/app/containers/product-list/selectors'
import {getCategoryHref} from 'web/app/store/categories/selectors'

import {canonicalURL} from '../../utils'
import urlMapper from 'web/app/config/url-mapper'

const ProductListFilterModal = ({sheetId, productSearch}) => {
    const {filters = []} = productSearch || {}
    const toggleFilterSheet = `tap:${sheetId}.toggle`

    return (
        <Sheet
            id={sheetId}
            className="m-product-list-filter-modal"
            side="right"
        >
            <HeaderBar>
                <HeaderBarTitle className="u-flex u-padding-start u-text-align-start">
                    <h1 className="u-h3 u-text-uppercase">
                        <span className="u-text-weight-extra-light">Filter Results By</span>
                    </h1>
                </HeaderBarTitle>

                <HeaderBarActions>
                    <IconLabelButton iconName="close" label="close" on={toggleFilterSheet}>Close</IconLabelButton>
                </HeaderBarActions>
            </HeaderBar>

            <Accordion initialOpenItems={[0]}>
                {filters.map(({label, ruleset, kinds}) =>
                    <AccordionItem header={label} key={ruleset} className="u-padding-0">
                        {/* disabling a11y lints because the below handler is
                            for the bubbled events from the children button elements */}
                        <div
                            className="m-product-list-filter-modal__items"
                            role="presentation"
                        >
                            {kinds.map(({count, label, query, searchKey}) => {

                                const searchState = {
                                    sort: productSearch.selectedSortingOption,
                                    start: 0,
                                    filters: {
                                        [ruleset]: searchKey
                                    }
                                }

                                const categoryFilter = productSearch.selectedFilters.find(({ruleset}) => ruleset === 'Category')
                                if (categoryFilter) {
                                    searchState.filters.cgid = categoryFilter.query.match(/cgid=(.+)/)[1]
                                }

                                return (<Button
                                    key={query}
                                    className="c--link u-width-full u-text-letter-spacing-normal"
                                    innerClassName="u-justify-start"
                                    id={query}
                                    href={`${canonicalURL('')}${urlMapper.getSearchUrl(searchState)}`}
                                >
                                    <div>
                                        <span className="u-color-brand">{label}</span> <span className="u-color-neutral-40">({count})</span>
                                    </div>
                                </Button>)
                            })}
                        </div>
                    </AccordionItem>
                )}
            </Accordion>
        </Sheet>
    )
}

ProductListFilterModal.propTypes = {
    /*
     * An array of filters
     */
    categoryHref: PropTypes.string,
    filters: PropTypes.array,
    productSearch: PropTypes.object,
    sheetId: PropTypes.string,
}

const mapStateToProps = createPropsSelector({
    productSearch: selectors.getProductSearch,
    categoryHref: getCategoryHref
})

export default ampComponent(connect(
    mapStateToProps
)(ProductListFilterModal))
