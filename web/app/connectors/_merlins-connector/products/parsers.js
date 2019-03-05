/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {extractMagentoJson} from '../utils'
import {getTextFrom, parseTextLink, parseImage} from 'progressive-web-sdk/dist/utils/parser-utils'
import {parsePrice} from 'mobify-integration-manager/dist/utils/parser-utils'
import {extractPathFromURL} from 'progressive-web-sdk/dist/utils/utils'

const UENC_REGEX = /\/uenc\/([^/,]+),*\//

const parseCarouselItems = (magentoObject) => {
    const carouselSetup = magentoObject
          .getIn(['[data-gallery-role=gallery-placeholder]', 'mage/gallery/gallery', 'data'])
          .sortBy((item) => item.get('position'))
    return carouselSetup.toJS()
}

const parseVariationCategories = (magentoObject) => {
    const optionList = magentoObject
            .getIn(['#product_addtocart_form', 'configurable', 'spConfig', 'attributes'])
            .toJS()

    return Object.keys(optionList).map((key) => {
        const option = optionList[key]
        const {code, id, label, options} = option
        const values = options.map(({label, products, id}) => {
            return {
                label,
                value: id,
                products
            }
        })

        return {
            id,
            name: code,
            label,
            values
        }
    })
}

const parseVariantIds = (variationCategories) => {
    return variationCategories
        .map((category) => category.values)
        .reduce((a, b) => a.concat(b))
        .reduce((a, b) => {
            if (b.products) {
                b.products.forEach((product) => {
                    if (a.indexOf(product) < 0) {
                        a.push(product)
                    }
                })
            }
            return a
        }, [])
}

const parseDefaultVariant = (magentoObject) => {
    const {defaultValues} = magentoObject
            .getIn(['#product_addtocart_form', 'configurable', 'spConfig'])
            .toJS()

    return defaultValues
}

const buildVariantFromId = (id, variationCategories) => {
    const variant = {
        id,
        values: {},
        attributeIds: {}
    }

    variationCategories.forEach((category) => {
        const selectedCategory = category.values.find((option) => option.products.find((product) => product === id))
        variant.values[category.name] = selectedCategory.value
        variant.attributeIds[category.name] = category.id
    })

    return variant
}

const buildVariants = (magentoObject, variationCategories) => {
    const variantIds = parseVariantIds(variationCategories)
    return variantIds.map((id) => buildVariantFromId(id, variationCategories))
}

const setInitialVariantValues = (variationCategories, magentoObject) => {
    const initialValues = {}
    const selectedVariant = parseDefaultVariant(magentoObject)

    if (selectedVariant) {
        variationCategories.forEach(({id, name}) => {
            initialValues[name] = selectedVariant[id]
        })

        return initialValues
    }

    variationCategories.forEach(({name, values}) => {
        initialValues[name] = values[0].value
    })

    return initialValues
}

const carouselItemsToImages = (carouselItems) => {
    return carouselItems.map(({img, isMain, full, thumb, caption}) => ({
        alt: caption || '',
        src: img,
        isMain,
        zoomSrc: full,
        thumbnailSrc: thumb,
        caption,
    }))
}

const parseBreadcrumbs = ($, $breadcrumbsLinks) => {
    return $breadcrumbsLinks.get()
        .map((breadcrumbLink) => {
            const parsedLink = parseTextLink($(breadcrumbLink))
            return parsedLink.set('href', extractPathFromURL(parsedLink.get('href')))
        })
}

const getAvailabilityFrom = ($content) => !!$content.find('button.tocart').length

export const parseProductID = ($product) => {
    // Wishlist is the only element containing the product ID
    // when the item is out of stock.
    const $wishlist = $product.find('.towishlist')
    const productData = JSON.parse($wishlist.attr('data-post'))
    return productData.data.product
}

export const productDetailsParser = ($, $html) => {
    const $mainContent = $html.find('.page-main')
    const magentoObject = extractMagentoJson($html)
    const carouselItems = parseCarouselItems(magentoObject)
    const images = carouselItemsToImages(carouselItems)
    const hasVariants = !!magentoObject.getIn(['#product_addtocart_form', 'configurable', 'spConfig', 'attributes'])
    const variationCategories = hasVariants ? parseVariationCategories(magentoObject) : []
    const title = getTextFrom($mainContent, '.page-title-wrapper.product .page-title > span')
    const description = getTextFrom($mainContent, '.product.info.detailed .product.attibute.description p')
    const metaDescription = $html.find('meta[name="description"]').attr('content')

    return {
        id: $mainContent.find('#product_addtocart_form input[name="product"]').val(),
        title,
        price: parsePrice(getTextFrom($mainContent, '.product-info-price .price-wrapper .price')),
        description,
        pageMeta: {
            title,
            description: metaDescription,
            keywords: $html.find('meta[name="keywords"]').attr('content') || ''
        },
        available: getAvailabilityFrom($mainContent),
        images,
        initialValues: hasVariants ? setInitialVariantValues(variationCategories, magentoObject) : {},
        variants: hasVariants ? buildVariants(magentoObject, variationCategories) : [],
        variationCategories
    }
}

export const productDetailsUIParser = ($, $html) => {
    const $breadcrumbs = (
        $html
            .find('.breadcrumbs')
            .find('li')
            .find('a')
    )

    const $form = $html.find('.page-main #product_addtocart_form')

    return {
        breadcrumbs: parseBreadcrumbs($, $breadcrumbs),
        itemQuantity: parseInt($form.find('#qty').val())
    }
}

export const pdpAddToCartFormParser = ($, $html) => {
    const $form = $html.find('.page-main #product_addtocart_form')

    const hiddenInputs = {}
    $form.find('input[type="hidden"]').each((idx, input) => {
        const $input = $(input)
        hiddenInputs[$input.attr('name')] = $input.val()
    })
    const uencMatch = UENC_REGEX.exec($form.attr('action'))
    const uenc = uencMatch ? uencMatch[1] : ''

    return {
        submitUrl: $form.attr('action'),
        method: $form.attr('method'),
        uenc,
        hiddenInputs
    }
}

export const productListParser = ($, $html) => {
    const $products = $html.find('.item.product-item')

    const productMap = {}
    $products.each((_, product) => {
        const $product = $(product)
        const link = parseTextLink($product.find('.product-item-link'))
        const productId = parseProductID($product)
        const thumbnail = parseImage($product.find('.product-image-photo'))
        const available = $product.find('.stock.unavailable').length === 0

        productMap[productId] = {
            id: productId,
            title: link.text,
            price: parsePrice(getTextFrom($product, '.price')),
            available,
            href: link.href,
            thumbnail,
            images: [thumbnail]
        }
    })
    return productMap
}
