/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable no-unused-vars */

import {receiveProductSearchData} from 'mobify-integration-manager/dist/integration-manager/api/product-search/results'
import {receiveProductsData} from 'mobify-integration-manager/dist/integration-manager/api/products/results'

const mapSearchResultIntoProduct = (searchResult) => {
    const {
        productId,
        productName,
        available,
        image,
        price = '',
        href
    } = searchResult

    const images = [{
        alt: image.alt,
        src: image.link
    }]

    return {
        id: productId,
        title: productName,
        price,
        href,
        available,
        images
    }
}

const searchKey = '{"count":10,"filters":{"cgid":"newarrivals"},"sort":"name-descending","start":0}'
const productSearchData = {
    selectedFilters: [{
        label: 'New Arrivals',
        query: 'cgid=newarrivals',
        ruleset: 'Category'
    }],
    start: 0,
    products: [{
        productId: '1',
        href: '/1.html',
        productName: 'Zip Front Tank with Ruffles Blouse.',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25697713?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Zip Front Tank with Ruffles Blouse., , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw206bb703/images/large/PG.10256690.JJ169XX.PZ.jpg',
            title: 'Zip Front Tank with Ruffles Blouse., '
        },
        price: 59
    }, {
        productId: '25791388',
        href: '/25791388.html',
        productName: 'Zacco',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25791388?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Zacco, , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw430b0c2b/images/large/PG.CJZACCO.BLKBKPA.PZ.jpg',
            title: 'Zacco, '
        },
        price: 99
    }, {
        productId: 'microsoft-xbox360-bundle',
        href: '/microsoft-xbox360-bundle.html',
        productName: 'Xbox 360 Bundle',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/microsoft-xbox360-bundle?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Xbox 360 Bundle, , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw8895ff4c/images/large/microsoft-xbox360-bundle.jpg',
            title: 'Xbox 360 Bundle, '
        },
        price: undefined
    }, {
        productId: '25697682',
        href: '/25697682.html',
        productName: 'Woven Trimmed Cardigan.',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25697682?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Woven Trimmed Cardigan., , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwf9f6af17/images/large/PG.10256582.JJAE6A0.PZ.jpg',
            title: 'Woven Trimmed Cardigan., '
        },
        price: 89
    }, {
        productId: '25493646',
        href: '/25493646.html',
        productName: 'Wide Waist Pencil Skirt',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25493646?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Wide Waist Pencil Skirt, , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw6a345ea3/images/large/PG.10207165.JJ1ANB1.PZ.jpg',
            title: 'Wide Waist Pencil Skirt, '
        },
        // href:/ '/s/2017refresh/dw/shop/v17_4/products/25493646?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending.html',
        price: 109
    }, {
        productId: '25696685',
        href: '/25696685.html',
        productName: 'Wide Leg Pant.',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25696685?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Wide Leg Pant., , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwc71c5397/images/large/PG.10245233.JJ3WDXX.PZ.jpg',
            title: 'Wide Leg Pant., '
        },
        price: 119
    }, {
        productId: '25518958',
        href: '/25518958.html',
        productName: 'Wide Leg Pant',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25518958?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Wide Leg Pant, , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwdec2c798/images/large/PG.10204145.JJBF5XX.PZ.jpg',
            title: 'Wide Leg Pant, '
        },
        price: 79
    }, {
        productId: '25501785',
        href: '/25501785.html',
        productName: 'Wide Leg Pant',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25501785?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Wide Leg Pant, , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwb85b2ba3/images/large/PG.10204121.JJG80XX.PZ.jpg',
            title: 'Wide Leg Pant, '
        },
        price: 79
    }, {
        productId: '25328702',
        href: '/25328702.html',
        productName: 'Washable Wool Classic Straight Skirt ',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25328702?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Washable Wool Classic Straight Skirt , , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw3b76d64a/images/large/PG.10176157.JJ5AJXX.PZ.jpg',
            title: 'Washable Wool Classic Straight Skirt , '
        },
        price: 89
    }, {
        productId: '25593301',
        href: '/25593301.html',
        productName: 'Washable Linen Slim Pant',
        link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh/dw/shop/v17_4/products/25593301?count=10&start=0&refine=cgid%3Dnewarrivals&sort=name-descending',
        image: {
            _type: 'image',
            alt: 'Washable Linen Slim Pant, , large',
            link: 'https://mobify-tech-prtnr-na03-dw.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwa30c882c/images/large/PG.10243116.JJ2DGXX.PZ.jpg',
            title: 'Washable Linen Slim Pant, '
        },
        price: 89
    }],
    total: 239,
    query: '',
    count: 10,
    sortingOptions: [{
        _type: 'product_search_sorting_option',
        id: 'price-low-to-high',
        label: 'Price Low To High'
    }, {
        _type: 'product_search_sorting_option',
        id: 'price-high-to-low',
        label: 'Price High To Low'
    }, {
        _type: 'product_search_sorting_option',
        id: 'name-ascending',
        label: 'Name (A-Z)'
    }, {
        _type: 'product_search_sorting_option',
        id: 'name-descending',
        label: 'Name (Z-A)'
    }],
    filters: [{
        label: 'Category',
        ruleset: 'cgid',
        kinds: [{
            label: 'New Arrivals',
            count: 239,
            searchKey: 'newarrivals',
            query: 'newarrivals'
        }, {
            label: 'Womens',
            count: 191,
            searchKey: 'womens',
            query: 'womens'
        }, {
            label: 'Mens',
            count: 20,
            searchKey: 'mens',
            query: 'mens'
        }, {
            label: 'Electronics',
            count: 28,
            searchKey: 'electronics',
            query: 'electronics'
        }]
    }, {
        label: 'Color',
        ruleset: 'c_refinementColor',
        kinds: [{
            label: 'Beige',
            count: 7,
            searchKey: 'Beige',
            query: 'Beige'
        }, {
            label: 'Black',
            count: 69,
            searchKey: 'Black',
            query: 'Black'
        }, {
            label: 'Blue',
            count: 36,
            searchKey: 'Blue',
            query: 'Blue'
        }, {
            label: 'Navy',
            count: 2,
            searchKey: 'Navy',
            query: 'Navy'
        }, {
            label: 'Brown',
            count: 26,
            searchKey: 'Brown',
            query: 'Brown'
        }, {
            label: 'Green',
            count: 8,
            searchKey: 'Green',
            query: 'Green'
        }, {
            label: 'Grey',
            count: 19,
            searchKey: 'Grey',
            query: 'Grey'
        }, {
            label: 'Orange',
            count: 1,
            searchKey: 'Orange',
            query: 'Orange'
        }, {
            label: 'Pink',
            count: 10,
            searchKey: 'Pink',
            query: 'Pink'
        }, {
            label: 'Purple',
            count: 2,
            searchKey: 'Purple',
            query: 'Purple'
        }, {
            label: 'Red',
            count: 3,
            searchKey: 'Red',
            query: 'Red'
        }, {
            label: 'White',
            count: 47,
            searchKey: 'White',
            query: 'White'
        }, {
            label: 'Yellow',
            count: 8,
            searchKey: 'Yellow',
            query: 'Yellow'
        }, {
            label: 'Miscellaneous',
            count: 7,
            searchKey: 'Miscellaneous',
            query: 'Miscellaneous'
        }]
    }, {
        label: 'Price',
        ruleset: 'price',
        kinds: [{
            label: '$20 - $49.99',
            count: 29,
            searchKey: '(20..50)',
            query: '(20..50)'
        }, {
            label: '$50 - $99.99',
            count: 118,
            searchKey: '(50..100)',
            query: '(50..100)'
        }, {
            label: '$100 - $499.99',
            count: 62,
            searchKey: '(100..500)',
            query: '(100..500)'
        }, {
            label: '$500 - $999.99',
            count: 6,
            searchKey: '(500..1000)',
            query: '(500..1000)'
        }]
    }, {
        label: 'New Arrival',
        ruleset: 'c_isNew',
        kinds: [{
            label: 'true',
            count: 15,
            searchKey: 'true',
            query: 'true'
        }]
    }, {
        label: 'bySheets',
        ruleset: 'c_sheets',
        kinds: []
    }],
    selectedSortingOption: 'name-descending'
}

export const searchProducts = (searchParams) => (dispatch) => {
    console.log('[Stub Connector] Called searchProducts stub')

    dispatch(receiveProductSearchData({
        [searchKey]: productSearchData
    }))

    const productMap = {}
    productSearchData.products.forEach((product) => {
        productMap[product.productId] = mapSearchResultIntoProduct(product)
    })
    dispatch(receiveProductsData(productMap))

    return Promise.resolve()
}
