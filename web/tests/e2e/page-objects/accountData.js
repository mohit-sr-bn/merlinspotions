/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const testData = {
    email: 'mobifyautomation@gmail.com',
    password: 'p4ssword',

    name: 'John Doe',
    address: '1 Hacker Way',
    city: 'Menlo Park',
    state: '//*[text()="California"]',
    // Hybris uses a Region string instead of a select
    stateString: 'California',
    country: '//*[text()="United States"]',
    postCode: '94025',
    phone: '6508531300',

    creditCardNumber: '4111111111111111',
    expiry: '0922',
    cvv: '123'
}

export default testData
