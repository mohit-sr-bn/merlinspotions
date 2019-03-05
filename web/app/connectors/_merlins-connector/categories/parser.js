/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {getTextFrom} from 'progressive-web-sdk/dist/utils/parser-utils'

/* eslint-disable newline-per-chained-call */

export const parseCategoryTitle = ($, $html) => getTextFrom($html, '.page-title')

export const parsePageMeta = ($, $html) => {
    const description = $html.find('meta[name="description"]')
    const keywords = $html.find('meta[name="keywords"]')
    return {
        title: parseCategoryTitle($, $html),
        description: description.attr('content') || '',
        keywords: keywords.attr('content') || '',
    }
}

export const parseParentCategoryId = ($, $html) => {
    const $crumb = $html
        .find('.breadcrumbs li:last')
        .prev()

    return $crumb.length ?
        $crumb.attr('class').split(' ')[1] :
        'home'
}

export const parseCategoryId = ($, $html) => {
    const className = $html.find('body').attr('class')
    const classMatch = className.match(/categorypath-([^\s]+)/)

    return classMatch ? classMatch[1] : null
}

export const parseCategory = ($, $html) => {
    const $mainContent = $html.find('#maincontent')

    const id = parseCategoryId($, $html)
    const title = $mainContent.find('.page-title-wrapper').text().trim()
    // TODO: Meta data should be part of the UI, not the data models. Fix this.
    const pageMeta = parsePageMeta($, $html)
    const parentId = parseParentCategoryId($, $html)

    return {
        id,
        title,
        href: '',
        url: '',
        pageMeta,
        parentId
    }
}
