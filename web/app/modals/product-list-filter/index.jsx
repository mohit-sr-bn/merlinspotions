/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {PRODUCT_LIST_FILTER_MODAL} from '../constants'
import {closeModal, openModal} from '../actions'

import {HeaderBar, HeaderBarActions, HeaderBarTitle} from 'progressive-web-sdk/dist/components/header-bar'
import Sheet from 'progressive-web-sdk/dist/components/sheet'
import IconLabelButton from '../../components/icon-label-button'
import ProductFilter from '../../components/product-filter'


const FILTER_QUERY = 'filter_is_open'


class ProductListFilterModal extends React.Component {
    componentDidMount() {
        if (window.location.search.indexOf(FILTER_QUERY) > 0) {
            this.props.openModal()
        }
    }

    render() {
        const {closeModal, isOpen, duration} = this.props

        return (
            <Sheet
                className="m-product-list__filter-modal"
                open={isOpen}
                onDismiss={closeModal}
                duration={duration}
                maskOpacity={0.7}
                effect="slide-right"
                shrinkToContent={false}
                coverage="85%"
            >
                <HeaderBar>
                    <HeaderBarTitle className="u-flex u-padding-start u-text-align-start">
                        <h1 className="u-h3 u-text-uppercase">
                            <span className="u-text-weight-extra-light">Filter Results By</span>
                        </h1>
                    </HeaderBarTitle>

                    <HeaderBarActions>
                        <IconLabelButton iconName="close" label="" onClick={closeModal} analyticsName={UI_NAME.dismissModal}>Close</IconLabelButton>
                    </HeaderBarActions>
                </HeaderBar>

                <ProductFilter />

            </Sheet>
        )
    }
}


ProductListFilterModal.propTypes = {
    /**
     * A function used to set the filter sheet's state to closed
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
     * A function used to set the filter sheet's state to open
     */
    openModal: PropTypes.func,
}

const mapStateToProps = createPropsSelector({
    isOpen: isModalOpen(PRODUCT_LIST_FILTER_MODAL),
})

const mapDispatchToProps = {
    closeModal: () => closeModal(PRODUCT_LIST_FILTER_MODAL, UI_NAME.filters),
    openModal: () => openModal(PRODUCT_LIST_FILTER_MODAL, UI_NAME.filters)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductListFilterModal)
