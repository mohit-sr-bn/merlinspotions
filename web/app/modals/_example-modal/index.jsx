/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */


// # Setup Instructions
//
// When creating a brand new modal, please be sure to follow these steps:
//
// - [ ] Replace all instances of EXAMPLE_MODAL with a new constant
// - [ ] Rename the `ExampleModal` variable to one of your choice
// - [ ] Replace the `m-example-modal` className with one of your choice.
//       **NOTE** Modal classNames should start with an `m-` prefix!
// - [ ] Customize the modal as you see fit!


import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import Sheet from 'progressive-web-sdk/dist/components/sheet'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'

import {stripEvent} from 'progressive-web-sdk/dist/utils/utils'
import {closeModal} from '../actions'
import {EXAMPLE_MODAL} from '../constants'

const ExampleModal = ({
    isOpen,
    closeThisModal,
    duration,
}) => {

    //
    // Customize this modal as you see fit!
    //

    return (
        <Sheet
            className="m-example-modal"
            open={isOpen}
            onDismiss={closeThisModal}
            duration={duration}
            maskOpacity={0.7}
            effect="slide-right"
            coverage="85%"
        >
            <p>Insert your modal content here!</p>
        </Sheet>
    )
}

ExampleModal.propTypes = {
    closeThisModal: PropTypes.func,
    duration: PropTypes.number,
    isOpen: PropTypes.bool,
}

const mapStateToProps = createPropsSelector({
    isOpen: isModalOpen(EXAMPLE_MODAL),
})

const mapDispatchToProps = {
    closeThisModal: stripEvent(() => closeModal(EXAMPLE_MODAL)),
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExampleModal)
