/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/**
 * Return the page meta data for a specific container
 * @function
 * @returns {Object} The object contains pageMeta
 *
 * NOTE: This function is backlogged for rework
 * Page meta data should not be something that is bound by integration manager
 * Depending on connector type, there are various ways page meta data can be
 * composed of:
 * - Hard-coded based on page template
 * - Composition of various data from data api end-point
 * - Captured from original source document
 */
export const getPageMetaData = () => (dispatch) => {
    return Promise.resolve({
        pageMeta: {
            title: 'Stub Connector',
            description: 'This is an example page meta description',
            keywords: 'stub, connector, example'
        }
    })
}
