/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import queryString from 'query-string'

import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import {getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'
import {VIEWPORT_SIZE_NAMES} from 'progressive-web-sdk/dist/ssr/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {receiveCurrentProductId} from 'mobify-integration-manager/dist/integration-manager/results'

import {isRunningInAstro} from '../../app/selectors'
import * as selectors from '../selectors'
import urlMapper from '../../../config/url-mapper'

import {PLACEHOLDER_PRODUCT, ITEMS_PER_PAGE} from '../constants'
import {PRODUCT_LIST_FILTER_MODAL} from '../../../modals/constants'
import {openModal} from '../../../modals/actions'

import Button from 'progressive-web-sdk/dist/components/button'
import Field from 'progressive-web-sdk/dist/components/field'
import Image from 'progressive-web-sdk/dist/components/image'
import Pagination from 'progressive-web-sdk/dist/components/pagination'

import ProductFilter from '../../../components/product-filter'
import ProductTile from '../../../components/product-tile'

const ResultList = ({products, setProductId}) => (
    <section className="t-product-list__contents">
        {products.map((product, idx) => (
            <ProductTile
                key={product.productId ? product.productId : idx}
                itemScope
                itemType="http://schema.org/Product"
                className="t-product-list__tile"
                {...product}
                onClick={product ? () => setProductId(product.productId) : null}
                price={product.price && product.price.toString()}
                href={product.href || `/${product.productId}.html`}
                title={product.productName}
                description={false}
                thumbnail={{
                    alt: product.image.alt,
                    src: product.image.link
                }}
            />
        ))}
    </section>
)

ResultList.propTypes = {
    products: PropTypes.array,
    setProductId: PropTypes.func
}


const noResultsText = 'We can\'t find products matching the selection'
const emptySearchText = 'Your search returned no results. Please check your spelling and try searching again.'

const NoResultsList = ({routeName}) => (
    <div className="u-flexbox u-direction-column u-align-center">
        <Image
            className="u-flex-none"
            alt="Crystal Ball"
            width="122px"
            height="110px"
            src={getAssetUrl('static/img/global/no-results.png')}
        />

        <div className="t-product-list__no-results-text u-text-align-center">
            {routeName === 'searchResultPage' ? emptySearchText : noResultsText}
        </div>
    </div>
)

NoResultsList.propTypes = {
    routeName: PropTypes.string
}


const Skeleton = () => (
    <ResultList products={new Array(ITEMS_PER_PAGE).fill(PLACEHOLDER_PRODUCT)} />
)

const ProductListContents = ({
    productSearch,
    openModal,
    routeName,
    setProductId,
    uiState,
    isRunningInAstro,
    viewportSize
}) => {

    const {
        products = [],
        sortingOptions = [],
        filters = [],
        selectedFilters = [],
        start = 0,
        total = 0
    } = productSearch || {}

    const {count = 1} = uiState
    const contentsLoaded = !!productSearch
    const showListActionBar = !contentsLoaded || products.length > 0

    const filteredSelectedFilters = selectedFilters.filter((filter) => !filter.query.includes('cgid'))
    const hasSelectedFilters = filteredSelectedFilters.length > 0
    const hasFilters = filters.length > 0

    const pageCount = Math.ceil(total / count)
    const pageNumber = Math.floor(start / count) + 1

    const isLargeAndWider = viewportSize === VIEWPORT_SIZE_NAMES.LARGE || viewportSize === VIEWPORT_SIZE_NAMES.XLARGE



    const goToURL = (url) => {
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

    const clearFiltersUrl = (filterToRemove) => {
        const {filters, ...searchParams} = uiState

        // Remove the [filter] key we want from the {filters} object provided by
        // state.ui.productList.filters. To do this, we need to grab the object from
        // the state and rebuild it after removing the filter.
        // See: https://stackoverflow.com/questions/34401098/remove-a-property-in-an-object-immutably
        /* eslint-disable no-unused-vars */
        const {[filterToRemove]: discardedFilter, ...remainingFilters} = filters
        const finalFilter = {...searchParams, filters: remainingFilters, start: 0}
        return urlMapper.getSearchUrl(finalFilter)
    }

    const paginationProps = {
        className: 'u-margin-top-lg',
        onChange: (pageIndex) => {
            const url = urlMapper.getSearchUrl({
                ...uiState,
                start: pageIndex <= pageNumber ? (pageIndex - 1) * count : pageNumber * count,
                count,
                total
            })

            goToURL(url)
        },
        currentPage: pageNumber,
        pageCount,
        showCurrentPageMessage: false,
        showPageButtons: true
    }

    return (
        <div className="t-product-list__container">

            {(contentsLoaded && isLargeAndWider) &&
                <aside className="t-product-list__sidebar">
                    <ProductFilter />
                </aside>
            }

            <div className="t-product-list__main">
                <div className="t-product-list__main-header u-padding-bottom-lg">
                    {showListActionBar &&
                        <div className="u-flexbox">
                            <div className="t-product-list__filter">
                                {!isLargeAndWider &&
                                    <Button
                                        className="t-product-list__filter-button pw--tertiary"
                                        onClick={openModal}
                                        id="filterButton"
                                        data-analytics-name={UI_NAME.showFilters}
                                        disabled={!hasFilters}
                                    >
                                        Filter
                                    </Button>
                                }
                                <div className="t-product-list__product-count">
                                    {contentsLoaded ? `${total} Items` : `Loading...`}
                                </div>
                            </div>

                            <div className="t-product-list__sort">
                                <Field
                                    className="pw--has-select"
                                    idForLabel="sort"
                                    label={viewportSize === VIEWPORT_SIZE_NAMES.SMALL ? '' : 'Sort by'}
                                    labelPosition="end"
                                >
                                    <select
                                        className="u-color-neutral-60"
                                        onChange={(e) => (goToURL(e.target.value))}
                                        onBlur={(e) => (goToURL(e.target.value))}
                                        data-analytics-name={UI_NAME.sortBy}
                                        value={urlMapper.getSearchUrl({
                                            ...uiState,
                                            total
                                        })}
                                    >
                                        <option value="">Sort Options</option>
                                        {sortingOptions.map((choice, index) => {
                                            const label = viewportSize === VIEWPORT_SIZE_NAMES.SMALL ? `Sort: ${choice.label}` : choice.label

                                            return (
                                                <option
                                                    key={index}
                                                    value={urlMapper.getSearchUrl({
                                                        ...uiState,
                                                        sort: choice.id,
                                                        total
                                                    })}
                                                >
                                                    {label}
                                                </option>
                                            )
                                        }
                                        )}
                                    </select>
                                </Field>
                            </div>
                        </div>
                    }

                    {hasSelectedFilters &&
                        <div key="ruleset" className="u-flexbox">
                            {filteredSelectedFilters
                                .map(({label, query}) => {
                                    // Gets the key of the query we are trying to remove
                                    const queryKey = query.slice(0, query.indexOf('='))
                                    const href = clearFiltersUrl(queryKey)
                                    return (
                                        <div className="t-product-list__active-filter" key={query}>
                                            {label}
                                            <Button
                                                className="t-product-list__active-filter-cancel"
                                                icon="close"
                                                iconSize="medium"
                                                href={href}
                                                data-analytics-name={UI_NAME.clearFilters}
                                                title="Remove"
                                            />
                                        </div>
                                    )
                                }
                            )}
                        </div>
                    }
                </div>

                {/* Product List Content */}
                {contentsLoaded ?
                    <Fragment>
                        {products.length > 0 &&
                            <div className="t-product-list__main-contents">
                                <ResultList
                                    products={products}
                                    setProductId={setProductId}
                                />

                                {!isLargeAndWider ?
                                    <Pagination
                                        {...paginationProps}
                                        pagesToShow={5}
                                    />

                                :
                                    <Pagination
                                        {...paginationProps}
                                        pagesToShow={9}
                                        pagesToShowAtStart={2}
                                        pagesToShowAtEnd={2}
                                    />
                                }
                            </div>
                        }

                        {products.length <= 0 &&
                            <NoResultsList routeName={routeName} />
                        }
                    </Fragment>
                :
                    <Skeleton />
                }
            </div>

        </div>
    )
}

ProductListContents.propTypes = {
    isRunningInAstro: PropTypes.bool,
    location: PropTypes.object,
    openModal: PropTypes.func,
    productSearch: PropTypes.object,
    routeName: PropTypes.string,
    setProductId: PropTypes.func,
    uiState: PropTypes.object,
    viewportSize: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    productSearch: selectors.getProductSearch,
    uiState: selectors.getUIState,
    isRunningInAstro,
    viewportSize: getviewportSize
})

const mapDispatchToProps = {
    setProductId: receiveCurrentProductId,
    openModal: () => openModal(PRODUCT_LIST_FILTER_MODAL, UI_NAME.filters)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductListContents)
