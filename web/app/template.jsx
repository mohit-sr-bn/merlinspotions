import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {onRouteChanged} from 'progressive-web-sdk/dist/store/app/actions'
import {
    checkIfOffline,
    finishedRetryingConnection,
    unlockScroll
} from './containers/app/actions'
import {removeAllNotifications} from 'progressive-web-sdk/dist/store/notifications/actions'
import {incrementPageCount} from 'progressive-web-sdk/dist/store/push-messaging/actions'

import {PERFORMANCE_METRICS} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {onPageReady, trackPerformance, setPageTemplateName} from 'progressive-web-sdk/dist/analytics/actions'
import {hasFetchedCurrentPath} from 'progressive-web-sdk/dist/store/offline/selectors'
import {isServerSide} from 'progressive-web-sdk/dist/store/app/selectors'
import {setFetchedPage} from 'progressive-web-sdk/dist/store/offline/actions'
import {pushHistoryItem, setIsHistoryPage} from './containers/header/actions'
import {trigger as astroTrigger} from './utils/astro-integration'
import {ssrRenderingComplete, ssrRenderingFailed} from 'progressive-web-sdk/dist/utils/universal-utils'
import {getDisplayName} from 'progressive-web-sdk/dist/utils/component-utils'

import {getURL, getPath} from 'progressive-web-sdk/dist/utils/utils'

const initPage = (component) => (url, routeName) => (dispatch, getState) => {
    const currentState = getState()
    const isHistoryPage = currentState.ui && currentState.ui.header.get('isHistoryPage')
    const initAction = component.initAction

    if (!initAction) {
        return null
    }

    // If we're landing on a page navigated to from the "Back" button,
    // we don't want to push the history item onto the stack
    if (isHistoryPage) {
        dispatch(setIsHistoryPage(false))
    } else {
        dispatch(pushHistoryItem(url))
    }

    const fetchResolve = dispatch(initAction(url, routeName))

    if (!(fetchResolve && typeof fetchResolve.then === 'function')) {
        throw new Error(`Page container ${component.name}.initAction must return a Promise.`)
    }

    return fetchResolve
        .then(() => {
            ssrRenderingComplete(getState())
        })
        .then(() => {
            trackPerformance(PERFORMANCE_METRICS.isSavedPage, hasFetchedCurrentPath(currentState) ? 'true' : 'false')
            dispatch(setFetchedPage(url))
        })
        .then(() => {
            dispatch(onPageReady(routeName))
            trackPerformance(PERFORMANCE_METRICS.templateAPIEnd)
        })
        .catch((error) => {
            console.error(`Error executing fetch action for ${routeName}`, error)
            ssrRenderingFailed(error)
        })
        .then(() => {
            // Only make the offline check if we're client-side
            if (!isServerSide(currentState)) {
                dispatch(checkIfOffline(url, routeName))
            }
        })
        .then(() => dispatch(finishedRetryingConnection()))
}

const template = (WrappedComponent) => {
    class Template extends React.Component {
        constructor(props) {
            super(props)

            // The component we're dealing with could have been wrapped by multiple
            // higher-order components (HOC). We keep unwrapping until we get to a component
            // that doesn't have a WrappedComponent property. We _assume_ that means we've
            // gotten to the actual component we want to work with.
            const getRootComponent = (component) => {
                if (component.WrappedComponent) {
                    return getRootComponent(component.WrappedComponent)
                }
                return component
            }

            this.WrappedComponent = WrappedComponent
            const rootComponent = getRootComponent(WrappedComponent)
            this.initAction = initPage(rootComponent)
        }

        dispatchRouteChange({dispatch, location, route}) {
            const url = getURL(location)

            dispatch(onRouteChanged(url, route.routeName))
            dispatch(setPageTemplateName(route.routeName))
            dispatch(incrementPageCount())

            if (this.initAction) {
                dispatch(this.initAction(route.fetchUrl || url, route.routeName))
            }

            dispatch(removeAllNotifications())
            dispatch(unlockScroll())
        }

        componentWillMount() {
            this.dispatchRouteChange(this.props)
        }

        componentDidMount() {
            trackPerformance(PERFORMANCE_METRICS.templateDidMount)
            astroTrigger('pwa-navigated', {
                url: getURL(this.props.location),
                source: 'componentDidMount'
            })
        }

        componentWillReceiveProps(nextProps) {
            // We force a reload when attempting to recover from offline mode
            const forcingReload = nextProps.retryingConnection && !this.props.retryingConnection
            if (getPath(this.props.location) !== getPath(nextProps.location) || forcingReload) {
                this.dispatchRouteChange(nextProps)
                this.props.dispatch(removeAllNotifications())
            }
        }

        componentDidUpdate() {
            trackPerformance(PERFORMANCE_METRICS.templateDidMount)
            astroTrigger('pwa-navigated', {
                url: getURL(this.props.location),
                source: 'componentDidUpdate'
            })
        }

        render() {
            return (<WrappedComponent {...this.props} />)
        }
    }
    Template.WrappedComponent = WrappedComponent
    Template.displayName = `Template(${getDisplayName(WrappedComponent)})`
    Template.propTypes = {
        dispatch: PropTypes.func,
        location: PropTypes.object,
        retryingConnection: PropTypes.bool
    }

    return connect()(Template)
}

export default template
