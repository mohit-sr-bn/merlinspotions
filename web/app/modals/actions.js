import * as modalAction from 'progressive-web-sdk/dist/store/modals/actions'
import {lockScroll, unlockScroll} from '../containers/app/actions'

export const openModal = (modalName, analyticsName) => (dispatch) => {
    dispatch(modalAction.openModal(modalName, analyticsName))
    dispatch(lockScroll())
}

export const openPersistentModal = (modalName, analyticsName) => (dispatch) => {
    dispatch(modalAction.openPersistentModal(modalName, analyticsName))
    dispatch(unlockScroll())
}

export const closeModal = (modalName, analyticsName) => (dispatch) => {
    dispatch(modalAction.closeModal(modalName, analyticsName))
    dispatch(unlockScroll())
}
