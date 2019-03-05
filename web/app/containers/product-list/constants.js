/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import {DEFAULT_PAGE_SIZE} from '../../config/merlins/constants'

export const ITEMS_PER_PAGE = DEFAULT_PAGE_SIZE
export const DEFAULT_SORT_OPTION = 'default'
export const PLACEHOLDER_PRODUCT = {
    available: true,
    title: '',
    price: '',
    thumbnail: {
        alt: '',
        src: '',
        link: ''
    },
    image: {
        alt: '',
        src: '',
        link: ''
    }
}
