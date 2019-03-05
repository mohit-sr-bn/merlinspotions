/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import packagejson from '../../../package.json'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'
import {SEARCH_LIGHTBOX} from './constants'

// Components
import Img from 'mobify-amp-sdk/dist/components/img'
import Button from 'mobify-amp-sdk/dist/components/button'
import {HeaderBar, HeaderBarActions, HeaderBarTitle} from 'mobify-amp-sdk/dist/components/header-bar'
import Icon from 'mobify-amp-sdk/dist/components/icon'
import IconLabel from 'mobify-amp-sdk/dist/components/icon-label'
import Search from 'mobify-amp-sdk/dist/components/search'

// Utils
import {staticURL, canonicalURL} from '../../utils'

const Header = (props) => {
    const {navId} = props
    const openNav = `tap:${navId}.toggle`
    const openSearch = `tap:${SEARCH_LIGHTBOX}`

    const searchIcon = <Icon name="search" title="Submit search" />

    return (
        <header className="t-header">
            <div className="t-header__bar">
                <HeaderBar>
                    <HeaderBarActions>
                        <Button innerClassName="u-padding-0" on={openNav}>
                            <IconLabel iconName="menu" label="Menu" iconSize="medium" />
                        </Button>
                    </HeaderBarActions>
                    <HeaderBarActions>
                        <Button innerClassName="u-padding-0" on={openSearch}>
                            <IconLabel iconName="search" label="Search" iconSize="medium" />
                        </Button>
                    </HeaderBarActions>
                    <HeaderBarTitle href={canonicalURL('/')}>
                        <Img src={staticURL('svg/logo.svg')} width="67" height="28" layout="fixed" />
                    </HeaderBarTitle>
                    <HeaderBarActions>
                        <Button href="https://locations.merlinspotions.com/" className="t-header__link" innerClassName="u-padding-0">
                            <IconLabel iconName="store" label="Stores" iconSize="medium" />
                        </Button>
                    </HeaderBarActions>
                    <HeaderBarActions>
                        <Button href={canonicalURL('/checkout/cart/')} className="t-header__link" innerClassName="u-padding-0">
                            <IconLabel iconName="cart" label="Cart" iconSize="medium" />
                        </Button>
                    </HeaderBarActions>
                </HeaderBar>
            </div>

            <Search
                className="t-header__search"
                isOverlay
                lightboxId={SEARCH_LIGHTBOX}
                formProps={{
                    method: 'GET',
                    target: '_top',
                    action: `${packagejson.siteUrl}/catalogsearch/result/`
                }}
                submitButtonProps={{
                    className: 'a--secondary t-header__search-submit-button',
                    children: searchIcon
                }}
                inputProps={{
                    placeholder: 'Search the entire store',
                    name: 'q'
                }}
                closeButtonProps={{
                    className: 'u-visually-hidden'
                }}
            />
        </header>
    )
}

Header.propTypes = {
    navId: PropTypes.string
}

export default ampComponent(Header)
