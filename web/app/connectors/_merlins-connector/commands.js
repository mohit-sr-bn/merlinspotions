/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import * as productsCommands from './products/commands'
import * as productSearchCommands from './product-search/commands'
import * as categoriesCommands from './categories/commands'
import * as cartCommands from './cart/commands'
import * as appCommands from './app/commands'
import * as checkoutCommands from './checkout/commands'
import * as accountCommands from './account/commands'

export default {
    checkout: checkoutCommands,
    products: productsCommands,
    productSearch: productSearchCommands,
    categories: categoriesCommands,
    cart: cartCommands,
    app: appCommands,
    account: accountCommands
}
