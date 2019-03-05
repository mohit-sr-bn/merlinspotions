/* global SITE_NAME */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'

/**
 * PageMeta renders SEO <meta /> tags into the site <head> tag. The intended
 * way to use this component is to insert one in every container so every page
 * in the app renders a proper <title> tag as well as description and keyword
 * meta tags.
 */

const PageMeta = ({description, keywords, title}) => (
    <Helmet>
        <html lang="en-US" />

        <title key="pageMetaTitle">
            {title}
        </title>

        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#4E439B" />
        <meta name="charset" content="utf-8" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href={getAssetUrl('static/img/global/apple-touch-icon.png')} />
    </Helmet>
)

PageMeta.propTypes = {
    /**
     * description meta tag that will be rendered in the <head> tag
     */
    description: PropTypes.string,

    /**
     * Keyword meta tag that will be rendered in the <head> tag
     */
    keywords: PropTypes.string,

    /**
     * Title tag that will be rendered in the <head> tag
     */
    title: PropTypes.string,
}

export default PageMeta
