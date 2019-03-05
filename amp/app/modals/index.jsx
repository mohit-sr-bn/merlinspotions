/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'

// Modals
import Navigation from './navigation'
import ProductListFilterModal from './product-list-filter'
import SocialShareModal from './social-share-modal'

// Constants
import {NAV_SHEET, FILTER_SHEET, SOCIAL_SHARE_MODAL} from './constants'

// Unlike in the PWA, the AMP ModalManager is not responsible
// for determining which modals are open or closed.
// This is all managed within AMP itself.
// This component is only responsible for rendering all modals.

const ModalManager = () => [
    <Navigation key={NAV_SHEET} sheetId={NAV_SHEET} />,
    <ProductListFilterModal key={FILTER_SHEET} sheetId={FILTER_SHEET} />,
    <SocialShareModal key={SOCIAL_SHARE_MODAL} id={SOCIAL_SHARE_MODAL} />
]

export default ModalManager
