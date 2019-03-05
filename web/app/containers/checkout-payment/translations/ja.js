/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

export const checkoutPaymentMessages = {
    // Buttons
    'checkoutPayment.button.placeOrder': '発注する',
    'checkoutPayment.button.promocode': 'クーポンコード', // "Coupon code"
    'checkoutPayment.button.apply': '適用',
    'checkoutPayment.button.remove': '削除', // "Delete"

    // Headings
    'checkoutPayment.heading.payWithCard': 'お支払い', // "Payment"
    'checkoutPayment.heading.billingAddress': '請求先住所',
    'checkoutPayment.heading.orderSummary': '注文合計',

    // Product
    'checkoutPayment.product.quantity': '数量',
    'checkoutPayment.product.priceEach': 'それぞれ{price}',

    // Ledger
    'checkoutPayment.ledger.subtotal': '商品 ({count})', // "Product" (as in, total of all products...)
    'checkoutPayment.ledger.subtotalWithoutCount': '商品',
    'checkoutPayment.ledger.things.one': ' ', // not used in Japanese
    'checkoutPayment.ledger.things.many': ' ', // not used in Japanese
    'checkoutPayment.ledger.shipping': '配送方法 ({label})', // "Shipping method"
    'checkoutPayment.ledger.shippingWithoutLabel': '配送方法',
    'checkoutPayment.ledger.total': '合計金額', // "Order total"
    'checkoutPayment.ledger.discounts': '割引',
    'checkoutPayment.ledger.discount': 'ディスカウント：{coupon}',
    'checkoutPayment.ledger.taxes': '税金',

    // Notes and/or placeholders
    'checkoutPayment.form.sameAsShipping': 'お届け先住所を使う',
    'checkoutPayment.form.shipping': '配送方法', // "Shipping method"
    'checkoutPayment.form.enterPromo': 'クーポンコード', // "Coupon code"
    'checkoutPayment.form.cardExpFormat': '（月）/（年）',
    'checkoutPayment.form.fakeName': 'John Appleseed',

    // Form Labels
    'checkoutPayment.form.label.name': 'カード名義人',
    'checkoutPayment.form.label.cardNum': 'クレジットカード番号',
    'checkoutPayment.form.label.cardExp': '有効期限',
    'checkoutPayment.form.label.cardCvv': 'セキュリティコード',
    'checkoutPayment.form.label.newCard': '新しいクレジットカードを追加する',

    // Form validation
    'checkoutPayment.form.validation.fixCCNum': 'あなたのクレジットカード情報を入力してください。',
    'checkoutPayment.form.validation.fixExpiry': 'あなたのクレジットカード情報を入力してください。',
    'checkoutPayment.form.validation.fixCVVLength': 'あなたのクレジットカード情報を入力してください。',
}
