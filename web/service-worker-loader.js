/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

// MOBIFY PROGRESSIVE SERVICE WORKER LOADER
// DO NOT MODIFY WITHOUT APPROVAL FROM MOBIFY

// **WARNING:** Beware using ES6 features!
// This file is used as is in the browser!

/* eslint-disable no-var */
var locationQuery = self.location.search
var isPreview = /preview=true/.test(locationQuery)
var targetMatch = locationQuery.match(/target=([^&]*)/)
var target = (targetMatch && targetMatch[1]) || 'production'
/* eslint-enable no-var */

if (isPreview) {
    self.importScripts('https://localhost:8443/worker.js')
} else {
    self.importScripts('https://cdn.mobify.com/sites/merlinspotions/' + target + '/worker.js') // eslint-disable-line prefer-template
}
