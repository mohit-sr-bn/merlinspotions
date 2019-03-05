// SDK Components
import {Accordion} from 'mobify-amp-sdk/dist/components/accordion/index'
import AccordionBase from 'mobify-amp-sdk/dist/components/accordion/_base.scss'
import AccordionTheme from './styles/themes/amp-components/_accordion.scss'

import AmpUserNotification from 'mobify-amp-sdk/dist/components/user-notification'
import AmpUserNotificationBase from 'mobify-amp-sdk/dist/components/user-notification/_base.scss'
import AmpUserNotificationTheme from 'mobify-amp-sdk/dist/components/user-notification/_theme.scss'

import Breadcrumbs from 'mobify-amp-sdk/dist/components/breadcrumbs/index'
import BreadcrumbsBase from 'mobify-amp-sdk/dist/components/breadcrumbs/_base.scss'
import BreadcrumbsTheme from './styles/themes/amp-components/_breadcrumbs.scss'

import Button from 'mobify-amp-sdk/dist/components/button/index'
import ButtonBase from 'mobify-amp-sdk/dist/components/button/_base.scss'
import ButtonTheme from './styles/themes/amp-components/_button.scss'

import Carousel from 'mobify-amp-sdk/dist/components/carousel/index'
import CarouselBase from 'mobify-amp-sdk/dist/components/carousel/_base.scss'
import CarouselTheme from './styles/themes/amp-components/_carousel.scss'

import ErrorContainer from './containers/error/container'
import ErrorContainerStyles from './containers/error/_container.scss'

import Field from 'mobify-amp-sdk/dist/components/field/index'
import FieldBase from 'mobify-amp-sdk/dist/components/field/_base.scss'
import FieldTheme from './styles/themes/amp-components/_field.scss'

import FieldRow from 'mobify-amp-sdk/dist/components/field-row/index'
import FieldRowBase from 'mobify-amp-sdk/dist/components/field-row/_base.scss'
import FieldRowTheme from './styles/themes/amp-components/_field-row.scss'

import {HeaderBar} from 'mobify-amp-sdk/dist/components/header-bar/index'
import HeaderBarBase from 'mobify-amp-sdk/dist/components/header-bar/_base.scss'
import HeaderBarTheme from './styles/themes/amp-components/_header-bar.scss'

import Icon from 'mobify-amp-sdk/dist/components/icon/index'
import IconBase from 'mobify-amp-sdk/dist/components/icon/_base.scss'
import IconTheme from './styles/themes/amp-components/_icon.scss'

import IconLabel from 'mobify-amp-sdk/dist/components/icon-label/index'
import IconLabelBase from 'mobify-amp-sdk/dist/components/icon-label/_base.scss'
import IconLabelTheme from './styles/themes/amp-components/_icon-label.scss'

import Img from 'mobify-amp-sdk/dist/components/img/index'
import ImgBase from 'mobify-amp-sdk/dist/components/img/_base.scss'

import Lightbox from 'mobify-amp-sdk/dist/components/lightbox/index'
import LightboxBase from 'mobify-amp-sdk/dist/components/lightbox/_base.scss'

import List from 'mobify-amp-sdk/dist/components/list/index'
import ListTheme from './styles/themes/amp-components/_list.scss'

import ListTile from 'mobify-amp-sdk/dist/components/list-tile/index'
import ListTileBase from 'mobify-amp-sdk/dist/components/list-tile/_base.scss'
import ListTileTheme from './styles/themes/amp-components/_list-tile.scss'

import Nav from 'mobify-amp-sdk/dist/components/nav/index'
import NavBase from 'mobify-amp-sdk/dist/components/nav/_base.scss'
import NavTheme from './styles/themes/amp-components/_nav.scss'

import NavItem from 'mobify-amp-sdk/dist/components/nav-item/index'
import NavItemBase from 'mobify-amp-sdk/dist/components/nav-item/_base.scss'
import NavItemTheme from './styles/themes/amp-components/_nav-item.scss'

import NavMenu from 'mobify-amp-sdk/dist/components/nav-menu/index'
import NavMenuBase from 'mobify-amp-sdk/dist/components/nav-menu/_base.scss'
import NavMenuTheme from './styles/themes/amp-components/_nav-menu.scss'

import Pagination from 'mobify-amp-sdk/dist/components/pagination/index'
import PaginationBase from 'mobify-amp-sdk/dist/components/pagination/_base.scss'
import PaginationTheme from './styles/themes/amp-components/_pagination.scss'

import Search from 'mobify-amp-sdk/dist/components/search/index'
import SearchBase from 'mobify-amp-sdk/dist/components/search/_base.scss'
import SearchTheme from './styles/themes/amp-components/_search.scss'

import Sheet from 'mobify-amp-sdk/dist/components/sheet/index'
import SheetBase from 'mobify-amp-sdk/dist/components/sheet/_base.scss'
import SheetTheme from './styles/themes/amp-components/_sheet.scss'

import SkipLinks from 'mobify-amp-sdk/dist/components/skip-links/index'
import SkipLinksBase from 'mobify-amp-sdk/dist/components/skip-links/_base.scss'

import SocialShare from 'mobify-amp-sdk/dist/components/social-share/index'
import SocialShareBase from 'mobify-amp-sdk/dist/components/social-share/_base.scss'
import SocialShareTheme from './styles/themes/amp-components/_social-share.scss'

import Stepper from 'mobify-amp-sdk/dist/components/stepper/index'
import StepperBase from 'mobify-amp-sdk/dist/components/stepper/_base.scss'
import StepperTheme from './styles/themes/amp-components/_stepper.scss'

import {Swatch} from 'mobify-amp-sdk/dist/components/swatch/index'
import SwatchBase from 'mobify-amp-sdk/dist/components/swatch/_base.scss'
import SwatchTheme from './styles/themes/amp-components/_swatch.scss'


// Local Components
import Card from './components/card/index'
import CardTheme from './components/card/_theme.scss'

import IconLabelButton from './components/icon-label-button/index'
import IconLabelButtonBase from './components/icon-label-button/_base.scss'

import ProductItem from './components/product-item/index'
import ProductItemBase from './components/product-item/_base.scss'

import ProductTile from './components/product-tile/index'
import ProductTileBase from './components/product-tile/_base.scss'

// Containers
import Footer from './containers/footer/container'
import FooterStyles from './containers/footer/_container.scss'

import Header from './containers/header/container'
import HeaderStyles from './containers/header/_container.scss'

import ProductDetails from './containers/product-details/container'
import ProductDetailsStyles from './containers/product-details/_container.scss'

import ProductList from './containers/product-list/container'
import ProductListStyles from './containers/product-list/_container.scss'


// Modals
import Navigation from './modals/navigation/index'
import NavigationStyles from './modals/navigation/_navigation.scss'

import ProductListFilterModal from './modals/product-list-filter/index'
import ProductListFilterModalStyles from './modals/product-list-filter/_product-list-filter.scss'

import SocialShareModal from './modals/social-share-modal/index'
import SocialShareModalStyles from './modals/social-share-modal/_social-share-modal.scss'


const styles = new Map()

// SDK Components
styles.set(Accordion, [AccordionBase, AccordionTheme])
styles.set(AmpUserNotification, [AmpUserNotificationBase, AmpUserNotificationTheme])
styles.set(Breadcrumbs, [BreadcrumbsBase, BreadcrumbsTheme])
styles.set(Button, [ButtonBase, ButtonTheme])
styles.set(Carousel, [CarouselBase, CarouselTheme])
styles.set(ErrorContainer, [ErrorContainerStyles])
styles.set(Field, [FieldBase, FieldTheme])
styles.set(FieldRow, [FieldRowBase, FieldRowTheme])
styles.set(HeaderBar, [HeaderBarBase, HeaderBarTheme])
styles.set(Icon, [IconBase, IconTheme])
styles.set(IconLabel, [IconLabelBase, IconLabelTheme])
styles.set(Img, [ImgBase])
styles.set(Lightbox, [LightboxBase])
styles.set(List, [ListTheme])
styles.set(ListTile, [ListTileBase, ListTileTheme])
styles.set(Nav, [NavBase, NavTheme])
styles.set(NavItem, [NavItemBase, NavItemTheme])
styles.set(NavMenu, [NavMenuBase, NavMenuTheme])
styles.set(Pagination, [PaginationBase, PaginationTheme])
styles.set(Search, [SearchBase, SearchTheme])
styles.set(Sheet, [SheetBase, SheetTheme])
styles.set(SkipLinks, [SkipLinksBase])
styles.set(Stepper, [StepperBase, StepperTheme])
styles.set(Swatch, [SwatchBase, SwatchTheme])


// Local Components
styles.set(Card, [CardTheme])
styles.set(IconLabelButton, [IconLabelButtonBase])
styles.set(ProductItem, [ProductItemBase])
styles.set(ProductTile, [ProductTileBase])
styles.set(SocialShare, [SocialShareBase, SocialShareTheme])


// Containers
styles.set(Footer, [FooterStyles])
styles.set(Header, [HeaderStyles])
styles.set(ProductDetails, [ProductDetailsStyles])
styles.set(ProductList, [ProductListStyles])


// Modals
styles.set(Navigation, [NavigationStyles])
styles.set(ProductListFilterModal, [ProductListFilterModalStyles])
styles.set(SocialShareModal, [SocialShareModalStyles])

export default styles
