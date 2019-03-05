/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import Stepper from 'progressive-web-sdk/dist/components/stepper'
import Field from 'progressive-web-sdk/dist/components/field'

/**
 * A quantity stepper for products
 */

class ItemQuantityStepper extends React.Component {
    componentWillReceiveProps(nextProps) {
        // It's possible for these values to get desynced in the native app's cart modal
        // If the quantity of an item changes after the Stepper has already rendered,
        // it won't automatically update because it is only used for initialValue
        // In that case, force it to update with the new value
        if (this.stepper && this.stepper.state.value !== nextProps.quantity) {
            this.stepper.setBoundedValue(nextProps.quantity)
        }
    }

    render() {
        const {
            cartItemId,
            quantity,
            changeQuantity,
            className,
            name,
        } = this.props

        return (
            <Field label="Quantity" idFor={`quantity-${cartItemId}`} className={className}>
                <Stepper
                    className="pw--simple t-cart__product-stepper"
                    idForLabel={`quantity-${cartItemId}`}
                    incrementIcon="plus"
                    decrementIcon="minus"
                    initialValue={quantity}
                    minimumValue={1}
                    onChange={changeQuantity}
                    name={name}
                    stepperRef={(ref) => { this.stepper = ref }}
                    />
            </Field>
        )
    }
}


ItemQuantityStepper.propTypes = {
    /**
     * The id for the item associated with the stepper
     */
    cartItemId: PropTypes.string,
    /**
     * A callback function that will update the quantity for the item
     */
    changeQuantity: PropTypes.func,
    /**
     * Additional classes to apply to the component
     */
    className: PropTypes.string,
    /**
     * Name of the input in the stepper
     */
    name: PropTypes.string,
    /**
     * The current quantity of the item
     */
    quantity: PropTypes.number

}

export default ItemQuantityStepper
