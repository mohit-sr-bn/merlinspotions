/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

// configuration is not currently used by the stub connector
let config = {} // eslint-disable-line

export const registerConfig = (cfg) => {
    config = cfg
}

export const getJQueryResponse = () => config.features.jqueryResponse
