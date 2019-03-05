/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import {ACCOUNT_REMOVE_ADDRESS_MODAL} from '../constants'
import {removeAddress} from '../../containers/account-address/actions'
import {closeModal} from '../actions'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {getAddressID} from '../../containers/account-address/selectors'

import Sheet from 'progressive-web-sdk/dist/components/sheet'
import Button from 'progressive-web-sdk/dist/components/button'
import Image from 'progressive-web-sdk/dist/components/image'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const AccountRemoveAddressModal = ({closeModal, isOpen, removeAddress, removeAddressID, duration}) => {
    return (
        <Sheet
            className="pw--no-shadow m-cart__account-remove-address-modal"
            open={isOpen}
            onDismiss={closeModal}
            duration={duration}
            maskOpacity={0.7}
            effect="modal-center"
            shrinkToContent={true}
            coverage="90%"
        >
            <div className="u-flexbox u-direction-column u-align-center u-padding-md u-padding-top-lg u-padding-bottom-lg u-text-align-center">
                <div className="u-padding-md">
                    <Image
                        src={getAssetUrl('static/img/cart/remove-item@2x.png')}
                        alt="Stars and motion lines indicating something has disappeared"
                        height="75px"
                        width="95px"
                    />
                </div>

                <p className="u-margin-bottom-lg u-padding-start-lg u-padding-end-lg">
                    <strong>Are you sure you want to delete this address?</strong>
                </p>

                <div className="u-flex u-flexbox">
                    <Button
                        className="pw--tertiary u-text-uppercase u-flex"
                        onClick={closeModal}
                        data-analytics-name={UI_NAME.cancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="pw--secondary u-text-uppercase u-flex u-margin-start"
                        onClick={() => {
                            closeModal()
                            removeAddress(removeAddressID)
                        }}
                        data-analytics-name={UI_NAME.confirmation}
                    >
                        Ok
                    </Button>
                </div>
            </div>
        </Sheet>
    )
}

AccountRemoveAddressModal.propTypes = {
    /**
     * A function used to set the navigation-sheet's state to closed
     */
    closeModal: PropTypes.func,
    /**
     * Duration will define the time the animation takes to complete.
     */
    duration: PropTypes.number,
    /**
     * Whether the modal is open or not
     */
    isOpen: PropTypes.bool,
    /**
    * Removes the address
    */
    removeAddress: PropTypes.func,
    /**
    * The id of the address being deleted
    */
    removeAddressID: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    isOpen: isModalOpen(ACCOUNT_REMOVE_ADDRESS_MODAL),
    removeAddressID: getAddressID
})

const mapDispatchToProps = {
    closeModal: () => closeModal(ACCOUNT_REMOVE_ADDRESS_MODAL, UI_NAME.removeSavedAddress),
    removeAddress
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountRemoveAddressModal)
