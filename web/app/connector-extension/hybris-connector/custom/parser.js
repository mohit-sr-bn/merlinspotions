/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

export const parseDeliveryCountries = ({countries = []} = {}) => {
    return countries.map(({isocode, name}) => ({
        id: isocode,
        label: name,
        regionRequired: true,
        postcodeRequired: true
    }))
}
