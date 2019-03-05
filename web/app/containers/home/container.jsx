/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

// Components
import template from '../../template'
import PageMeta from '../../components/page-meta'

import {initialize} from './actions'

// Partials
import HomeCarousel from './partials/home-carousel'
import HomeCategories from './partials/home-categories'
import HomePopularProducts from './partials/home-popular-products'

// Selectors
import {getHomePageMeta, getHeroProducts} from './selectors'
import {isServerSideOrHydrating} from 'progressive-web-sdk/dist/store/app/selectors'

const Home = ({pageMeta, products, isServerSideOrHydrating}) => {
    return (
        <div className="t-home__container">
            <PageMeta {...pageMeta} description="Merlin's Potions" />
            <HomeCarousel isServerSideOrHydrating={isServerSideOrHydrating} />
            <HomeCategories />
            { products && <HomePopularProducts products={products} isServerSideOrHydrating={isServerSideOrHydrating} /> }
        </div>
    )
}

Home.propTypes = {
    isServerSideOrHydrating: PropTypes.bool,
    pageMeta: PropTypes.object,
    products: PropTypes.array
}

Home.initAction = initialize

const mapStateToProps = createPropsSelector({
    isServerSideOrHydrating,
    pageMeta: getHomePageMeta,
    products: getHeroProducts,
})

const connectedHome = connect(mapStateToProps)(Home)

export default template(connectedHome)
