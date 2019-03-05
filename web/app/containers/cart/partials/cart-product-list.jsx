/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {createPropsSelector} from 'reselect-immutable-helpers'
import {openRemoveItemModal, saveToWishlist, updateItem} from '../actions'
import {receiveCurrentProductId} from 'mobify-integration-manager/dist/integration-manager/results'

import {getCartItemsFull, getCartSummaryCount} from 'progressive-web-sdk/dist/store/cart/selectors'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'
import {getAutoAddToCartInProgress} from '../selectors'

import {noop} from 'progressive-web-sdk/dist/utils/utils'

import Button from 'progressive-web-sdk/dist/components/button'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import Icon from 'progressive-web-sdk/dist/components/icon'
import List from 'progressive-web-sdk/dist/components/list'
import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'
import ItemQuantityStepper from '../../../components/item-quantity-stepper'
import ItemPrice from '../../../components/item-price'
import ProductItem from '../../../components/product-item'
import ProductImage from '../../../components/product-image'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const productItemClassNames = 'u-padding-top-lg u-padding-bottom-lg u-padding-start u-padding-end'

const ProductSkeleton = () => (
    <ProductItem
        className={productItemClassNames}
        title={<SkeletonText type="h3" className="u-margin-bottom-sm" />}
        image={<ProductImage src="" alt="null" />}
    >
        <SkeletonText width="60%" style={{lineHeight: '20px'}} />
        <SkeletonText width="60%" style={{lineHeight: '20px'}} className="u-margin-bottom-sm" />
        <div className="t-cart__product-content-placeholder" />
    </ProductItem>
)


/* eslint-disable camelcase */

class CartProductItem extends React.Component {
    constructor(props) {
        super(props)

        this.changeQuantity = this.changeQuantity.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.saveForLater = this.saveForLater.bind(this)
    }

    changeQuantity(newQty) {
        this.props.onQtyChange(this.props.cartItemId, newQty)
    }

    removeItem() {
        this.props.openRemoveItemModal(this.props.cartItemId)
    }

    saveForLater() {
        this.props.onSaveLater(this.props.productId, this.props.cartItemId, this.props.href, this.props.quantity)
    }

    render() {
        const {
            cartItemId,
            configureUrl,
            quantity,
            price,
            itemPrice,
            linePrice,
            thumbnail,
            title,
            options,
            productId,
            setCurrentProduct
        } = this.props

        return (
            <ProductItem customWidth="40%"
                className={productItemClassNames}
                title={<h2 className="u-h5 u-text-family u-text-weight-semi-bold">{title}</h2>}
                image={<ProductImage {...thumbnail} />}
            >

                {options &&
                    <div className="u-margin-bottom-sm">
                        {options.map((option) => (
                            <p key={option.value} className="u-color-neutral-50">
                                {option.label} - {option.value}
                            </p>
                        ))}
                    </div>
                }

                <FieldRow className="u-align-bottom">
                    <ItemQuantityStepper
                        cartItemId={cartItemId}
                        changeQuantity={this.changeQuantity}
                        quantity={quantity}
                        name={`quantity-${cartItemId}`}
                    />

                    <ItemPrice
                        linePrice={linePrice}
                        itemPrice={itemPrice}
                        originalPrice={price}
                        quantity={quantity}
                    />
                </FieldRow>

                <div className="u-flexbox">
                    <Button
                        className="u-text-size-small u-color-brand u-flex-none u-text-letter-spacing-normal"
                        innerClassName="pw--no-min-width u-padding-start-0 u-padding-bottom-0"
                        href={configureUrl}
                        data-analytics-name={UI_NAME.editItem}
                        onClick={() => setCurrentProduct(productId)}
                        >
                        Edit
                    </Button>

                    <Button
                        className="u-text-size-small u-color-brand u-padding-start-0 u-padding-end-0 u-text-letter-spacing-normal"
                        innerClassName="u-padding-bottom-0 u-padding-start-0"
                        onClick={this.saveForLater}
                        data-analytics-name={UI_NAME.saveItem}
                        >
                        Save for Later
                    </Button>

                    <Button
                        className="u-text-size-small u-color-brand u-text-letter-spacing-normal qa-cart__remove-item"
                        innerClassName="u-padding-end-0 u-padding-bottom-0 u-padding-start-0"
                        onClick={this.removeItem}
                        data-analytics-name={UI_NAME.removeItem}
                        >
                        Remove
                    </Button>
                </div>
            </ProductItem>
        )
    }
}

CartProductItem.defaultProps = {
    onQtyChange: noop
}

CartProductItem.propTypes = {
    linePrice: PropTypes.string.isRequired,
    cartItemId: PropTypes.string, /* CartItem.id */
    configureUrl: PropTypes.string,
    href: PropTypes.string,
    itemPrice: PropTypes.string,
    openRemoveItemModal: PropTypes.func,
    options: PropTypes.array,
    price: PropTypes.string,
    productId: PropTypes.string,
    quantity: PropTypes.number,
    setCurrentProduct: PropTypes.func,
    thumbnail: PropTypes.object,
    title: PropTypes.string,
    onQtyChange: PropTypes.func,
    onSaveLater: PropTypes.func
}

const CartProductList = ({
    autoAddToCartInProgress,
    items,
    isLoggedIn,
    summaryCount,
    onSaveLater,
    onUpdateItemQuantity,
    openRemoveItemModal,
    onOpenSignIn,
    setCurrentProduct
}) => {
    const isCartEmpty = items.length === 0

    return (
        <div className="t-cart__product-list">
            <div className="t-cart__product-list-title u-padding-top-md u-padding-bottom-md">
                <div className="u-flexbox u-align-center">
                    {!autoAddToCartInProgress &&
                        <h1 className="u-flex u-text-uppercase">
                            Cart {summaryCount > 0 && <span className="u-text-weight-light">({summaryCount} Items)</span>}
                        </h1>
                    }

                    {!isLoggedIn &&
                        <Button
                            className="u-flex-none u-color-brand u-text-letter-spacing-normal"
                            onClick={onOpenSignIn}
                            data-analytics-name={UI_NAME.goToSignIn}
                        >
                            <Icon name="user" />
                            Sign in
                        </Button>
                    }
                </div>
            </div>

            <List className="u-bg-color-neutral-00 u-border-light-top u-border-light-bottom">
                {(isCartEmpty || autoAddToCartInProgress) &&
                    <ProductSkeleton className={productItemClassNames} />
                }

                {!autoAddToCartInProgress && items.map((item) => (
                    <CartProductItem {...item}
                        cartItemId={item.id}
                        setCurrentProduct={setCurrentProduct}
                        key={item.id}
                        onQtyChange={onUpdateItemQuantity}
                        onSaveLater={onSaveLater}
                        openRemoveItemModal={openRemoveItemModal}
                    />)
                )}
            </List>
        </div>
    )
}

CartProductList.propTypes = {
    autoAddToCartInProgress: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    items: PropTypes.array,
    openRemoveItemModal: PropTypes.func,
    setCurrentProduct: PropTypes.func,
    summaryCount: PropTypes.number,
    onOpenSignIn: PropTypes.func,
    onSaveLater: PropTypes.func,
    onUpdateItemQuantity: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    autoAddToCartInProgress: getAutoAddToCartInProgress,
    items: getCartItemsFull,
    summaryCount: getCartSummaryCount,
    isLoggedIn: getIsLoggedIn
})

const mapDispatchToProps = {
    onUpdateItemQuantity: updateItem,
    onSaveLater: saveToWishlist,
    openRemoveItemModal,
    setCurrentProduct: receiveCurrentProductId
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartProductList)
