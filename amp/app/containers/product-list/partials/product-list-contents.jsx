/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import URL from 'url'
import {validatePageNumber} from 'progressive-web-sdk/dist/utils/utils'
import {canonicalURL, staticURL} from '../../../utils'
import querystring from 'querystring'

// Components
import Img from 'mobify-amp-sdk/dist/components/img'
import Button from 'mobify-amp-sdk/dist/components/button'
import Form from 'mobify-amp-sdk/dist/components/form'
import Field from 'mobify-amp-sdk/dist/components/field'
import List from 'mobify-amp-sdk/dist/components/list'
import Pagination from 'mobify-amp-sdk/dist/components/pagination'
import ProductTile from '../../../components/product-tile'
import Card from '../../../components/card'

// Selectors
import * as selectors from 'web/app/containers/product-list/selectors'
import {getCurrentUrl} from 'progressive-web-sdk/dist/store/app/selectors'

import {ITEMS_PER_PAGE} from 'web/app/containers/product-list/constants'

const noResultsText = 'We can\'t find products matching the selection'
const emptySearchText = 'Your search returned no results. Please check your spelling and try searching again.'

const formAction = (currentUrl) => {
    const action = URL.parse(canonicalURL(currentUrl))
    action.query = null
    action.search = null
    action.fragment = null
    return URL.format(action)
}

export const getCurrentPageNumberFromUrl = (currentUrl, pageCount) => {
    const parsedUrl = URL.parse(currentUrl, true)
    return validatePageNumber(parsedUrl.query.p, pageCount)
}

export const getPaginationHref = (offset, currentUrl, pageCount) => {
    const currentPageNumber = getCurrentPageNumberFromUrl(currentUrl)
    const nextPage = currentPageNumber + offset

    // If this button can't take us any further, don't return a link so it will
    // be rendered as disabled properly
    if (nextPage < 1 || nextPage > pageCount) {
        return null
    }

    const parsedUrl = URL.parse(currentUrl, true)

    parsedUrl.query.p = validatePageNumber(nextPage, pageCount)
    // url.format won't update based on changes to .query, so we need to rewrite .search
    parsedUrl.search = `?${querystring.stringify(parsedUrl.query)}`
    return URL.format(parsedUrl)
}

const ResultList = ({products}) => (
    <List className="a--borderless">
        {products.map((product, idx) => (
            <Card hasShadow key={product ? product.productId : idx} itemScope itemType="http://schema.org/Product">
                <ProductTile
                    id={product.productId}
                    href={canonicalURL(product.href)}
                    price={product.price}
                    title={product.productName}
                    thumbnail={{
                        alt: product.image.alt,
                        src: product.image.link
                    }}
                />
            </Card>
        ))}
    </List>
)

ResultList.propTypes = {
    products: PropTypes.array
}

const NoResultsList = ({routeName}) => (
    <div className="u-flexbox u-direction-column u-align-center">
        <Img
            className="u-flex-none"
            alt="Crystal Ball"
            width="122"
            height="110"
            layout="fixed"
            src={staticURL('img/global/no-results.png')}
        />

        <div className="t-product-list__no-results-text u-text-align-center">
            {routeName === 'searchResultPage' ? emptySearchText : noResultsText}
        </div>
    </div>
)

NoResultsList.propTypes = {
    routeName: PropTypes.string
}

const ProductListContents = (props) => {
    const {sheetId, productSearch, routeName, currentUrl} = props
    const numItems = 10
    const products = productSearch.products
    const activeFilters = []

    const toggleFilterSheet = `tap:${sheetId}.toggle`
    const formId = `${sheetId}__form`

    const pageCount = Math.ceil(numItems / ITEMS_PER_PAGE)

    return (
        <div>
            <div className="t-product-list__container u-padding-end u-padding-bottom-lg u-padding-start">
                <div className="t-product-list__num-results u-padding-md u-padding-start-sm u-padding-end-sm">
                    <div>
                        {products && products.length > 0 &&
                            <div className="u-flexbox">
                                <div className="t-product-list__filter u-flex u-margin-end-md">
                                    <Field
                                        idForLabel="filterButton"
                                        label={`${products.length} Items`}
                                    >
                                        <Button
                                            className="a--tertiary u-width-full u-text-uppercase"
                                            disabled={routeName === 'searchResultPage' || activeFilters.length > 0}
                                            id="filterButton"
                                            on={toggleFilterSheet}
                                        >
                                            Filter
                                        </Button>
                                    </Field>
                                </div>

                                <div className="t-product-list__sort u-flex">
                                    <Form id={formId} method="GET" target="_top" action={formAction(currentUrl)}>
                                        <Field
                                            className="a--has-select"
                                            idForLabel="sort"
                                            label="Sort by"
                                        >
                                            <select
                                                name="product_list_order"
                                                className="u-color-neutral-60"
                                                on={`change:${formId}.submit`}
                                            >
                                                <option value="">Position</option>
                                                <option value="name">Name</option>
                                                <option value="price">Price</option>
                                            </select>
                                        </Field>
                                    </Form>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {(products && products.length > 0) ?
                    <ResultList products={products} />
                :
                    <NoResultsList routeName={routeName} />
                }

                {pageCount > 1 &&
                    <Pagination
                        className="u-margin-top-lg"
                        pageCount={pageCount}
                        currentPage={getCurrentPageNumberFromUrl(currentUrl, pageCount)}
                        showCurrentPageMessage={true}
                        showPageButtons={false}
                        prevButton={{
                            props: {
                                href: getPaginationHref(-1, currentUrl, pageCount),
                                text: 'Prev'
                            }
                        }}
                        nextButton={{
                            props: {
                                href: getPaginationHref(1, currentUrl, pageCount),
                                text: 'Next'
                            }
                        }}
                    />
                }
            </div>
        </div>
    )
}

ProductListContents.propTypes = {
    productSearch: PropTypes.object.isRequired,
    currentUrl: PropTypes.string,
    routeName: PropTypes.string,
    sheetId: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    currentUrl: getCurrentUrl,
    productSearch: selectors.getProductSearch
})

export default connect(mapStateToProps)(ProductListContents)
