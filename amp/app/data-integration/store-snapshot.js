/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

// Get the final state of the redux store
// If you want to add additional logging for Redux actions,
// that can be implemented here

let storeSnapshot = {}
export const middleware = (store) => (next) => (action) => {
    const result = next(action)
    storeSnapshot = store.getState()
    return result
}

export const getStoreSnapshot = () => storeSnapshot
