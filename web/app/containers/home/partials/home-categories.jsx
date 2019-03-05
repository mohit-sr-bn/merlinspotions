/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'

import Button from 'progressive-web-sdk/dist/components/button'
import Image from 'progressive-web-sdk/dist/components/image'
import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'
import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'
import LazyLoadContent from '../../../components/lazy-load-content'
import Card from '../../../components/card'
import * as selectors from '../selectors'

import {getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'
import {VIEWPORT_SIZE_NAMES} from 'progressive-web-sdk/dist/ssr/constants'

const CategoryImage = ({alt}) => {
    const placeholder = <SkeletonBlock height="60px" width="60px" />

    if (!alt) {
        return placeholder
    }

    return (
        <LazyLoadContent className="u-text-align-center" placeholder={placeholder}>
            <Image
                src={getAssetUrl(`static/img/categories/${alt.trim().replace(/\s+/g, '-')
                    .toLowerCase()}@2x.png`)}
                alt={alt}
                height="60px"
                width="60px"
            />
        </LazyLoadContent>
    )
}

CategoryImage.propTypes = {
    alt: PropTypes.string
}

const HomeCategory = ({category: {path, title}}) => (
    <Button href={path} className="t-home__category-item u-padding-bottom-lg">
        <div className="u-flex">
            <CategoryImage alt={title} />

            {title ?
                <div className="t-home__category-text u-text-align-center">
                    {title}
                </div>
                :
                <SkeletonText
                    className="t-home__category-text"
                    style={{height: '16px', lineHeight: '20px'}}
                    width="100px"
                />
            }
        </div>
    </Button>
)

HomeCategory.propTypes = {
    category: PropTypes.shape({
        path: PropTypes.string,
        title: PropTypes.string
    }),
}

const categoriesMap = (categories) => {
    const categoriesMapped = categories.map((category, index) =>
        <HomeCategory category={category} key={index} />
    )

    // Mitch wants to cut out the 'Starters Kit'
    return categoriesMapped.slice(0, categoriesMapped.length - 1)
}

const HomeCategories = ({categories, viewportSize}) => {

    return (
        <Card>
            {(viewportSize === VIEWPORT_SIZE_NAMES.LARGE) ?
                <div className="t-home__category u-padding-start-lg u-padding-end-lg">
                    {categoriesMap(categories)}
                </div>
                : <div className="t-home__category">
                    {categoriesMap(categories)}
                </div>
            }
        </Card>
    )
}

HomeCategories.propTypes = {
    categories: PropTypes.array.isRequired,
    viewportSize: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    categories: selectors.getHomeCategories,
    viewportSize: getviewportSize
})

export default connect(mapStateToProps)(HomeCategories)
