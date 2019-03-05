/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

class Mapper {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl ? options.baseUrl : ''

        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((key) => {
            if (key !== 'constructor') {
                this[key] = this[key].bind(this)
            }
        })
    }
}

export default Mapper
