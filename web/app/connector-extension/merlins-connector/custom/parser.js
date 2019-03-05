/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

export const parseAccountLocations = (magentoResponse, $response) => {
    const regionDropdownData = magentoResponse.getIn(['#country', 'regionUpdater', 'regionJson']).toJS()
    const optionalZipList = magentoResponse.getIn(['#country', 'regionUpdater', 'countriesWithOptionalZip']).toJS()
    const regionRequiredMap = {}
    const postCodeOptionalMap = {}

    optionalZipList.forEach((countryId) => {
        postCodeOptionalMap[countryId] = true
    })

    const regions = []
    regionDropdownData.config.regions_required.forEach((country) => {
        const countryRegions = regionDropdownData[country]
        regionRequiredMap[country] = true

        Object.keys(countryRegions).forEach((region) => {
            regions.push({
                countryId: country,
                id: region,
                label: countryRegions[region].name
            })
        })
    })

    const countries = []

    $response.find('select#country option').each((_, option) => {
        const id = option.value
        countries.push({
            id,
            label: option.textContent,
            regionRequired: regionRequiredMap[id] || false,
            postcodeRequired: postCodeOptionalMap[id] || false
        })
    })

    return {
        countries,
        regions
    }
}
