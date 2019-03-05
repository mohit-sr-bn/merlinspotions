/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {productSubtotal, getHighResImage, getPriceFromFragment} from '../utils'

export const parseCartProducts = ({items}) => { /* Products */
    const products = items.map(({product_id, product_name, product_url, product_price, product_image}) => ({
        id: product_id,
        title: product_name,
        href: product_url,
        price: getPriceFromFragment(product_price),
        thumbnail: {
            src: getHighResImage(product_image.src),
            alt: product_image.alt || '',
            size: { /* See getHighResImage which has size hard-coded */
                width: '240px',
                height: '300px'
            }
        },
        available: true
    }))

    const productMap = {}
    products.forEach((product) => {
        productMap[product.id] = product
    })

    return productMap
}

export const parseCart = ({items, subtotal}) => { /* Cart */
    return {
        items: items.map(({item_id, product_id, product_url, qty, product_price, options}) => ({
            id: item_id,
            productId: product_id,
            href: product_url,
            options,
            quantity: qty,
            itemPrice: getPriceFromFragment(product_price),
            linePrice: productSubtotal(getPriceFromFragment(product_price), qty),
            configureUrl: `/checkout/cart/configure/id/${item_id}/product_id/${product_id}/` // eslint-disable-line camelcase
        })),
        subtotal: getPriceFromFragment(subtotal),
        orderTotal: getPriceFromFragment(subtotal)
    }
}

export const parseCartTotals = ({
    tax_amount,
    discount_amount,
    shipping_amount,
    base_grand_total,
    subtotal,
    subtotal_incl_tax
}) => {

    const initialCartTotals = {
        discount: '',
        orderTotal: '',
        shipping: {amount: ''},
        subtotal: '',
        tax: ''
    }

    // We need the grand total if there's a discount or non-free shipping.
    /* eslint-disable camelcase */
    const orderTotal = (discount_amount || shipping_amount > 0)
          ? base_grand_total
          : subtotal_incl_tax

    return {
        ...initialCartTotals,
        discount: `${discount_amount}`,
        shipping: {
            ...initialCartTotals.shipping,
            amount: `${shipping_amount}`
        },
        subtotal: `${subtotal}`,
        tax: `${tax_amount}`,
        orderTotal: `${orderTotal}`
    }
    /* eslint-enable camelcase */
}
